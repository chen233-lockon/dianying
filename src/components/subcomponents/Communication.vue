<template>
  <div class="forum-container">
    <!-- 论坛交流标题 -->
    <div class="forum-header">
      <h1 class="forum-title">FORUM / INFORMATION</h1>
      <p class="forum-subtitle">论坛交流</p>
    </div>

    <!-- 发布帖子按钮 -->
    <div class="post-button-container">
      <button class="btn btn-primary" @click="showModal">+ 发布帖子</button>
    </div>

    <!-- 帖子列表 -->
    <div class="post-list-container">
      <div v-for="post in paginatedPosts" :key="post.id" class="post-card">
        <div class="post-content">
          <div class="post-text" v-html="post.content"></div>
          <div class="post-meta">
            <span class="post-author">发布人: {{ post.author }}</span>
            <span class="post-time">{{ post.time }}</span>
          </div>
        </div>
        <div class="post-actions">
          <!-- Only show the three dots and dropdown if the current user is the author of the post -->
          <div
            v-if="currentUser && post.author === currentUser.nickname"
            class="more-actions"
            @click.stop="toggleDropdown(post.id)"
          >
            <span class="dots">...</span>
            <div v-if="activeDropdown === post.id" class="dropdown-menu">
              <button @click.stop="editPost(post)" class="dropdown-item">
                修改
              </button>
              <button @click.stop="deletePost(post.id)" class="dropdown-item">
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <button
        :disabled="currentPage === 1"
        @click="prevPage"
        class="pagination-btn"
        :class="{ disabled: currentPage === 1 }"
      >
        上一页
      </button>
      <span class="page-current">{{ currentPage }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="nextPage"
        class="pagination-btn"
        :class="{ disabled: currentPage === totalPages }"
      >
        下一页
      </button>
    </div>

    <!-- 发布帖子模态框 -->
    <div v-if="showPostModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>发布新帖子</h3>
          <span class="close-modal" @click="closeModal">&times;</span>
        </div>
        <div class="modal-body">
          <div ref="editor" class="editor-container"></div>
        </div>
        <div class="modal-footer">
          <button @click="submitPost" class="btn btn-primary">提交</button>
          <button @click="closeModal" class="btn btn-secondary">取消</button>
        </div>
      </div>
    </div>

    <!-- 编辑帖子模态框 -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>编辑帖子</h3>
          <span class="close-modal" @click="closeEditModal">&times;</span>
        </div>
        <div class="modal-body">
          <div ref="editEditor" class="editor-container"></div>
        </div>
        <div class="modal-footer">
          <button @click="submitEdit" class="btn btn-primary">提交修改</button>
          <button @click="closeEditModal" class="btn btn-secondary">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useAuthStore } from "@/stores/auth";
import { postAPI, userAPI } from "@/api/index.js";

// 数据响应式声明
const currentPage = ref(1);
const itemsPerPage = 10; // 每页显示10条帖子
const posts = ref([]);
const showPostModal = ref(false);
const showEditModal = ref(false);
const quill = ref(null);
const editQuill = ref(null);
const currentUser = ref(null);
const activeDropdown = ref(null);
const postToEdit = ref(null);
const authStore = useAuthStore();
const editor = ref(null);
const editEditor = ref(null);

// 初始化获取数据
onMounted(() => {
  fetchPosts();
  getCurrentUser();
});

// 获取当前用户
const getCurrentUser = async () => {
  try {
    if (authStore.user?.id) {
      const response = await userAPI.getUser(authStore.user.id);
      currentUser.value = response.data;
    } else {
      currentUser.value = null;
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
    currentUser.value = null;
  }
};

// 获取帖子列表
const fetchPosts = async () => {
  try {
    const response = await postAPI.getPosts();
    posts.value = response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

// 计算总页数
const totalPages = computed(() => {
  const total = Math.ceil(posts.value.length / itemsPerPage);
  return total > 0 ? total : 1;
});

// 分页数据
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return posts.value.slice(start, start + itemsPerPage);
});

// 分页控制
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 初始化 Quill 编辑器（创建帖子模态框）。
// 使用 nextTick 确保 DOM 渲染完成后再操作编辑器。
const showModal = () => {
  showPostModal.value = true;
  nextTick(() => {
    if (!quill.value && editor.value) {
      quill.value = new Quill(editor.value, {
        theme: "snow",
        placeholder: "请输入帖子内容...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image", "video"],
          ],
        },
      });
    } else if (quill.value) {
      quill.value.setText("");
    }
  });
};

// 关闭帖子模态框
const closeModal = () => {
  showPostModal.value = false;
  if (quill.value) {
    quill.value.setText("");
  }
};

// 提交新帖子
const submitPost = async () => {
  if (!currentUser.value || !quill.value) return;

  const newPost = {
    id: Date.now().toString(),
    content: quill.value.root.innerHTML,
    author: currentUser.value.nickname,
    time: new Date().toLocaleString(),
  };

  try {
    const postResponse = await postAPI.createPost(newPost);

    const updatedUser = {
      ...currentUser.value,
      comments: [
        ...(currentUser.value.comments || []),
        {
          postId: postResponse.data.id,
          content: newPost.content,
          time: newPost.time,
        },
      ],
    };

    await userAPI.updateUser(currentUser.value.id, updatedUser);

    // 更新本地数据
    posts.value = [...posts.value, postResponse.data];
    currentUser.value = updatedUser;
    closeModal();
  } catch (error) {
    console.error("Error submitting post:", error);
  }
};

// 判断是否为当前用户的帖子
const toggleDropdown = (postId) => {
  activeDropdown.value = activeDropdown.value === postId ? null : postId;
};

// 修改帖子
const editPost = (post) => {
  postToEdit.value = { ...post };
  showEditModal.value = true;
  nextTick(() => {
    if (!editQuill.value && editEditor.value) {
      editQuill.value = new Quill(editEditor.value, {
        theme: "snow",
        placeholder: "编辑帖子内容...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image", "video"],
          ],
        },
      });
    }
    // 将帖子内容粘贴到编辑器中
    if (editQuill.value) {
      editQuill.value.clipboard.dangerouslyPasteHTML(post.content || "");
    }
  });
};

// 提交修改帖子模态框
const submitEdit = async () => {
  if (!currentUser.value || !editQuill.value || !postToEdit.value) return;

  const editedContent = editQuill.value.root.innerHTML;
  if (!editedContent.trim()) {
    alert("帖子内容不能为空");
    return;
  }

  // 更新帖子内容
  const updatedPost = {
    ...postToEdit.value,
    content: editedContent,
    time: new Date().toLocaleString(),
  };

  try {
    await postAPI.updatePost(postToEdit.value.id, updatedPost);

    // 是否为当前用户的帖子
    posts.value = posts.value.map((post) =>
      post.id === postToEdit.value.id ? updatedPost : post
    );

    // 更新用户评论
    if (currentUser.value?.comments) {
      const updatedUser = {
        ...currentUser.value,
        comments: currentUser.value.comments.map((comment) =>
          comment.postId === postToEdit.value.id
            ? { ...comment, content: editedContent, time: updatedPost.time }
            : comment
        ),
      };
      await userAPI.updateUser(currentUser.value.id, updatedUser);
      currentUser.value = updatedUser;
    }

    closeEditModal();
  } catch (error) {
    console.error("Error updating post:", error);
  }
};

// 关闭帖子编辑模态框
const closeEditModal = () => {
  showEditModal.value = false;
  activeDropdown.value = null;
  nextTick(() => editQuill.value?.clipboard.dangerouslyPasteHTML(""));
  postToEdit.value = null;
};

// 删除帖子
const deletePost = async (postId) => {
  if (!confirm("确定要删除此帖子吗？")) return;

  try {
    await postAPI.deletePost(postId);
    posts.value = posts.value.filter((post) => post.id !== postId);

    if (currentUser.value?.comments) {
      currentUser.value.comments = currentUser.value.comments.filter(
        (comment) => comment.postId !== postId
      );
      await userAPI.updateUser(currentUser.value.id, currentUser.value);
    }
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};
</script>

<style scoped>
/* 全局样式 */
.forum-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* 标题样式 */
.forum-header {
  text-align: center;
  margin-bottom: 30px;
}

.forum-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 700;
}

.forum-subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin: 5px 0 0;
}

/* 按钮样式 */
.post-button-container {
  text-align: right;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

/* 帖子列表容器 */
.post-list-container {
  margin-bottom: 30px;
}

/* 帖子卡片样式 */
.post-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: transform 0.2s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 帖子内容 */
.post-content {
  flex: 1;
}

.post-text {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 10px;
  color: #34495e;
}

.post-meta {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.post-author {
  color: #3498db;
  font-weight: 600;
  margin-bottom: 5px;
}

.post-time {
  color: #95a5a6;
}

/* 帖子操作 */
.post-actions {
  position: relative;
}

.more-actions {
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f8f9fa;
  transition: all 0.2s ease;
}

.more-actions:hover {
  background-color: #e9ecef;
}

.dots {
  font-size: 1.2rem;
  color: #7f8c8d;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 100px;
  margin-top: 5px;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  background: none;
  border: none;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  font-size: 0.9rem;
  color: #34495e;
  transition: all 0.2s ease;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #3498db;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(.disabled) {
  background-color: #f8f9fa;
}

.pagination-btn.disabled {
  cursor: not-allowed;
  color: #ccc;
}

.page-current {
  margin: 0 15px;
  font-size: 1rem;
  color: #2c3e50;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.close-modal {
  font-size: 1.5rem;
  color: #95a5a6;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-modal:hover {
  color: #7f8c8d;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  max-height: 60vh;
}

.editor-container {
  height: 300px;
  margin-bottom: 10px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
}

.modal-footer button {
  margin-left: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .forum-title {
    font-size: 2rem;
  }

  .forum-subtitle {
    font-size: 1rem;
  }

  .post-card {
    flex-direction: column;
  }

  .post-actions {
    align-self: flex-end;
    margin-top: 10px;
  }

  .modal {
    width: 95%;
  }
}
</style>
