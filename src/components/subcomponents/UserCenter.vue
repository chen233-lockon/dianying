<template>
  <div class="user-profile">
    <!-- 如果用户已登录，显示用户信息 -->
    <div v-if="authStore.isLoggedIn">
      <!-- 用户信息展示区域 -->
      <div class="profile-container" v-if="!isEditing && userInfo">
        <!-- 顶部头像和基本信息 -->
        <div class="profile-header">
          <div class="avatar-wrapper">
            <img :src="userInfo.avatar" class="avatar" alt="用户头像" />
            <div class="edit-avatar-icon">✏️</div>
          </div>
          <div class="user-info">
            <h1 class="user-name">{{ userInfo.nickname }}</h1>
            <p class="user-title">{{ userInfo.identity }}</p>
            <div class="user-stats">
              <span class="stat-item">📅 加入时间: {{ userInfo.addtime }}</span>
              <span class="stat-item"
                >❤️ 收藏: {{ favoritesStore.favorites?.length || 0 }}</span
              >
            </div>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="profile-content">
          <!-- 基本信息卡片 -->
          <div class="info-card">
            <h2><i class="icon-basic"></i> 基本信息</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">性别</span>
                <span class="info-value">{{
                  userInfo.gender === "male" ? "男" : "女"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">年龄</span>
                <span class="info-value">{{ userInfo.age }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">生日</span>
                <span class="info-value">{{ userInfo.birthday }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">爱好</span>
                <span class="info-value">{{
                  userInfo.hobbies.join("、")
                }}</span>
              </div>
            </div>
          </div>

          <!-- 个人详情卡片 -->
          <div class="info-card">
            <h2><i class="icon-details"></i> 个人详情</h2>
            <div class="detail-content">
              <p class="signature">
                "{{ userInfo.signature || "这个人很懒，还没有设置签名" }}"
              </p>
            </div>
          </div>

          <!-- 收藏卡片 -->
          <div class="info-card">
            <h2><i class="icon-favorites"></i> 我的收藏</h2>
            <div class="favorites-grid">
              <div
                v-if="
                  favoritesStore.favorites && favoritesStore.favorites.length
                "
                class="favorites-list"
              >
                <div
                  v-for="(item, index) in favoritesStore.favorites"
                  :key="index"
                  class="favorite-item"
                >
                  <div class="favorite-image">
                    <img :src="item.image" alt="收藏图片" />
                  </div>
                  <div class="favorite-info">
                    <h3>{{ item.name }}</h3>
                    <p class="favorite-desc">{{ item.description }}</p>
                    <div class="favorite-meta">
                      <span>⭐ {{ item.score }}</span>
                      <span>🎬 {{ item.director }}</span>
                      <span>⏱️ {{ item.duration }}分钟</span>
                    </div>
                    <div class="favorite-actions">
                      <router-link
                        :to="'/home/database/detail/' + item.id"
                        class="detail-link"
                      >
                        <el-button size="mini">查看详情</el-button>
                      </router-link>
                      <el-button
                        size="mini"
                        @click.stop="removeFavorite(item.id)"
                        type="danger"
                      >
                        删除收藏
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">
                <i class="icon-empty">📭</i>
                <p>暂无收藏内容</p>
              </div>
            </div>
          </div>
        </div>

        <button @click="startEditing" class="edit-button">
          <i class="icon-edit">✏️</i> 修改资料
        </button>
      </div>

      <!-- 编辑表单 -->
      <div v-if="isEditing" class="edit-profile">
        <h2><i class="icon-edit-profile"></i> 编辑个人信息</h2>
        <form @submit.prevent="submitForm" class="edit-form">
          <div class="form-group">
            <label>昵称</label>
            <input
              v-model="ruleForm.nickname"
              type="text"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label>性别</label>
            <div class="select-wrapper">
              <select v-model="ruleForm.gender" class="form-select">
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
              <i class="icon-dropdown">▼</i>
            </div>
          </div>
          <div class="form-group">
            <label>年龄</label>
            <input
              v-model.number="ruleForm.age"
              type="number"
              class="form-input"
              min="1"
              max="120"
              required
            />
          </div>
          <div class="form-group">
            <label>生日</label>
            <input
              v-model="ruleForm.birthday"
              type="date"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label>身份</label>
            <input
              v-model="ruleForm.identity"
              type="text"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label>个人爱好</label>
            <div class="checkbox-group">
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  value="电影"
                  v-model="ruleForm.hobbies"
                />
                电影
              </label>
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  value="音乐"
                  v-model="ruleForm.hobbies"
                />
                音乐
              </label>
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  value="阅读"
                  v-model="ruleForm.hobbies"
                />
                阅读
              </label>
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  value="运动"
                  v-model="ruleForm.hobbies"
                />
                运动
              </label>
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  value="旅游"
                  v-model="ruleForm.hobbies"
                />
                旅游
              </label>
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  value="游戏"
                  v-model="ruleForm.hobbies"
                />
                游戏
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>个人签名</label>
            <textarea
              v-model="ruleForm.signature"
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="cancelEditing" class="btn btn-cancel">
              取消
            </button>
            <button type="submit" class="btn btn-save">保存修改</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 如果用户未登录，显示未登录提示 -->
    <div v-else class="not-logged-in">
      <div class="login-card">
        <div class="login-icon">👤</div>
        <h2>欢迎来到个人中心</h2>
        <p>请先登录以查看和管理您的个人信息</p>
        <button @click="goToLogin" class="login-button">立即登录</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { userAPI } from "@/api/index.js";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import { useFavoritesStore } from "@/stores/favorites";

const router = useRouter();
const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();

// 用户信息接口
interface UserInfo {
  id?: number;
  avatar: string;
  nickname: string;
  gender: string;
  age: number;
  birthday: string;
  identity: string;
  addtime: string;
  hobbies: string[];
  signature: string;
  account?: string;
}

// 表单接口
interface RuleForm {
  nickname: string;
  gender: string;
  age: number;
  addtime: string;
  birthday: string | null;
  identity: string;
  hobbies: string[];
  signature: string;
}

// 响应式数据
const userInfo = ref<UserInfo>({
  avatar: "",
  nickname: "",
  gender: "",
  age: 0,
  birthday: "",
  addtime: "",
  identity: "",
  hobbies: [],
  signature: "",
});

//存储更新数据
const ruleForm = reactive<RuleForm>({
  nickname: "",
  gender: "",
  age: 0,
  birthday: null,
  addtime: "",
  identity: "",
  hobbies: [],
  signature: "",
});

const isEditing = ref(false);

// 开始编辑
const startEditing = () => {
  if (!userInfo.value) return;

  isEditing.value = true;
  //将右侧对象复制到左侧对象
  Object.assign(ruleForm, {
    nickname: userInfo.value.nickname,
    gender: userInfo.value.gender,
    age: userInfo.value.age,
    birthday: userInfo.value.birthday || null,
    identity: userInfo.value.identity,
    hobbies: [...userInfo.value.hobbies],
    signature: userInfo.value.signature,
  });
};

// 取消编辑
const cancelEditing = () => {
  isEditing.value = false;
};

// 提交表单
const submitForm = async () => {
  if (!userInfo.value) return;

  try {
    // 合并用户数据
    const updatedUser = {
      ...userInfo.value,
      ...ruleForm,
      birthday: ruleForm.birthday || userInfo.value.birthday,
    };

    await userAPI.updateUser(userInfo.value.id, updatedUser);

    // 更新本地用户信息
    userInfo.value = updatedUser;

    // 更新 authStore 中的用户信息
    authStore.setUser(updatedUser);

    isEditing.value = false;
    ElMessage.success("个人信息修改成功");
  } catch (error) {
    console.error("更新用户信息失败:", error);
    ElMessage.error("更新用户信息失败");
  }
};

// 删除收藏
const removeFavorite = async (movieId) => {
  try {
    if (!authStore.isLoggedIn) {
      ElMessage.warning("请先登录后再操作");
      return;
    }

    await favoritesStore.removeFavorite(movieId);
    ElMessage.success("已取消收藏");

    // 重新获取用户数据以更新收藏列表
    await fetchUserData();
  } catch (error) {
    console.error("删除收藏失败:", error);
    ElMessage.error("删除收藏失败");
  }
};

// 获取用户数据
const fetchUserData = async () => {
  try {
    const response = await userAPI.getUsers();
    if (response.data && authStore.user) {
      const userData = response.data.find(
        (user) => user.account === authStore.user?.account
      );
      if (userData) {
        userInfo.value = userData;
      }
    }
  } catch (error) {
    console.error("获取用户数据失败:", error);
  }
};

// 跳转到登录页面
const goToLogin = () => {
  router.push("/qianlogin");
};

// 生命周期钩子
onMounted(() => {
  if (authStore.isLoggedIn) {
    fetchUserData();
    favoritesStore.fetchFavorites();
  }
});
</script>

<style scoped>
.user-profile {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
}

/* Profile Container */
.profile-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
}

/* Profile Header */
.profile-header {
  display: flex;
  padding: 30px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin-right: 30px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-avatar-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #4caf50;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transform: translate(5px, 5px);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px;
}

.user-title {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 15px;
}

.user-stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
  margin-top: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Profile Content */
.profile-content {
  padding: 30px;
}

.info-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 25px;
}

.info-card h2 {
  font-size: 20px;
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #444;
  display: flex;
  align-items: center;
}

.info-card h2 i {
  margin-right: 10px;
  font-size: 18px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.info-value {
  color: #333;
  flex: 1;
}

/* Detail Content */
.detail-content {
  line-height: 1.6;
}

.signature {
  font-style: italic;
  color: #666;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid #a777e3;
}

/* Favorites */
.favorites-grid {
  margin-top: 15px;
}

.favorites-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.favorite-item {
  display: flex;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.favorite-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.favorite-image {
  width: 150px;
  min-height: 150px;
  background-color: #f5f5f5;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-info {
  flex: 1;
  padding: 15px;
  margin: 20px;
}

.favorite-info h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
}

.favorite-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 15px;
}

.favorite-meta {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #888;
  margin-bottom: 15px;
}

.favorite-actions {
  display: flex;
  gap: 10px;
}

.detail-link {
  text-decoration: none;
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #888;
}

.empty-state i {
  font-size: 50px;
  margin-bottom: 15px;
  display: block;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

/* Edit Button */
.edit-button {
  position: absolute;
  top: 30px;
  right: 30px;
  background-color: #6e8efb;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.edit-button:hover {
  background-color: #5a7df4;
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

/* Edit Profile */
.edit-profile {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 30px;
}

.edit-profile h2 {
  font-size: 24px;
  margin: 0 0 25px;
  color: #444;
  display: flex;
  align-items: center;
}

.edit-profile h2 i {
  margin-right: 10px;
}

.edit-form {
  max-width: 700px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #6e8efb;
  box-shadow: 0 0 0 2px rgba(110, 142, 251, 0.2);
}

.select-wrapper {
  position: relative;
}

.select-wrapper i {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #777;
}

.form-select {
  appearance: none;
  background-color: white;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-item input {
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 10px 25px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-save {
  background-color: #6e8efb;
  color: white;
}

.btn-save:hover {
  background-color: #5a7df4;
}

/* Not Logged In */
.not-logged-in {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.login-card {
  text-align: center;
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  width: 100%;
}

.login-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.login-card h2 {
  margin: 0 0 15px;
  color: #444;
}

.login-card p {
  color: #666;
  margin: 0 0 25px;
}

.login-button {
  background-color: #6e8efb;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: #5a7df4;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;
  }

  .avatar-wrapper {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .user-stats {
    justify-content: center;
  }

  .favorite-item {
    flex-direction: column;
  }

  .favorite-image {
    width: 100%;
    min-height: 150px;
  }

  .edit-button {
    position: static;
    margin: 20px auto;
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .profile-content {
    padding: 15px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
