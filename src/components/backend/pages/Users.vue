<template>
  <div class="users-management">
    <!-- 头部区域 -->
    <div class="header">
      <h1>
        <el-icon><User /></el-icon> 用户管理
      </h1>
    </div>

    <!-- 统计卡片 -->
    <div class="stat-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon class="stat-icon" style="color: #409eff"><User /></el-icon>
          <div>
            <h3>总用户数</h3>
            <p>{{ usersStore.users.length }}</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 用户列表 -->
    <el-card>
      <template #header>
        <div class="table-header">
          <span>用户列表</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户..."
            clearable
            style="width: 300px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </template>

      <el-table
        :data="filteredUsers"
        border
        stripe
        style="width: 100%"
        v-loading="usersStore.loading"
      >
        <template #empty>
          <el-empty description="暂无用户数据" />
        </template>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="account" label="账号" width="150" />
        <el-table-column prop="nickname" label="昵称" width="150" />

        <el-table-column label="头像" width="100">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :size="40" />
          </template>
        </el-table-column>

        <el-table-column label="爱好" width="200">
          <template #default="{ row }">
            <el-tag
              v-for="(hobby, index) in getHobbies(row)"
              :key="index"
              type="success"
              size="small"
              style="margin: 2px"
            >
              {{ hobby }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="signature"
          label="个性签名"
          show-overflow-tooltip
        />

        <el-table-column label="收藏数" width="100">
          <template #default="{ row }">
            {{ getFavorites(row).length }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 查看/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isViewing ? '查看用户详情' : '编辑用户'"
      width="600px"
    >
      <el-form :model="form" label-width="100px" :disabled="isViewing">
        <el-form-item label="账号">
          <el-input v-model="form.account" :disabled="isViewing" />
        </el-form-item>

        <el-form-item label="昵称">
          <el-input v-model="form.nickname" />
        </el-form-item>

        <el-form-item label="头像URL">
          <el-input v-model="form.avatar" />
        </el-form-item>

        <el-form-item label="爱好">
          <el-select
            v-model="form.hobbies"
            multiple
            filterable
            allow-create
            placeholder="选择或输入爱好"
            style="width: 100%"
          >
            <el-option label="电影" value="电影" />
            <el-option label="音乐" value="音乐" />
            <el-option label="阅读" value="阅读" />
            <el-option label="运动" value="运动" />
            <el-option label="旅游" value="旅游" />
          </el-select>
        </el-form-item>

        <el-form-item label="个性签名">
          <el-input
            v-model="form.signature"
            type="textarea"
            :rows="3"
            placeholder="请输入个性签名"
          />
        </el-form-item>

        <el-form-item label="收藏电影" v-if="isViewing">
          <div>共收藏 {{ form.favorites?.length || 0 }} 部电影</div>
        </el-form-item>
      </el-form>

      <template #footer v-if="!isViewing">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUsersStore } from "../../../stores/users";
import { addOperationLog } from "../../../utils/operationLog";

const usersStore = useUsersStore();

// 响应式数据
const searchKeyword = ref("");
const dialogVisible = ref(false);
const isViewing = ref(false);
const form = ref({
  id: "",
  account: "",
  nickname: "",
  avatar: "",
  hobbies: [],
  signature: "",
  favorites: [],
  gender: "male",
  age: 18,
  identity: "普通用户",
});

// 计算属性
const filteredUsers = computed(() => {
  console.log("filteredUsers 计算, usersStore.users:", usersStore.users);
  if (!Array.isArray(usersStore.users)) {
    console.warn("usersStore.users 不是数组:", usersStore.users);
    return [];
  }
  const keyword = searchKeyword.value.toLowerCase();
  if (!keyword) {
    return usersStore.users;
  }
  return usersStore.users.filter(
    (u) =>
      u.account?.toLowerCase().includes(keyword) ||
      u.nickname?.toLowerCase().includes(keyword) ||
      u.signature?.toLowerCase().includes(keyword)
  );
});

// 生命周期
onMounted(async () => {
  console.log("用户管理页面加载");
  try {
    await usersStore.fetchUsers();
    console.log("usersStore.users:", usersStore.users);
    console.log("用户数量:", usersStore.users.length);
  } catch (error) {
    console.error("加载用户数据失败:", error);
    ElMessage.error("加载用户数据失败");
  }
});

// 页面激活时刷新数据
onActivated(async () => {
  console.log("用户管理页面激活");
  try {
    await usersStore.fetchUsers();
  } catch (error) {
    console.error("刷新用户数据失败:", error);
  }
});

// 辅助方法
const getHobbies = (user) => {
  if (!user || !user.hobbies) return [];
  if (Array.isArray(user.hobbies)) return user.hobbies;
  if (typeof user.hobbies === "string") {
    try {
      return JSON.parse(user.hobbies);
    } catch {
      return [];
    }
  }
  return [];
};

const getFavorites = (user) => {
  if (!user || !user.favorites) return [];
  if (Array.isArray(user.favorites)) return user.favorites;
  if (typeof user.favorites === "string") {
    try {
      return JSON.parse(user.favorites);
    } catch {
      return [];
    }
  }
  return [];
};

// 操作方法
const handleView = (user) => {
  console.log("查看用户:", user);
  isViewing.value = true;
  form.value = {
    ...user,
    hobbies: getHobbies(user),
    favorites: getFavorites(user),
  };
  dialogVisible.value = true;
};

const handleEdit = (user) => {
  console.log("编辑用户:", user);
  isViewing.value = false;
  form.value = {
    ...user,
    hobbies: getHobbies(user),
    favorites: getFavorites(user),
  };
  dialogVisible.value = true;
};

const handleDelete = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定删除用户 "${user.nickname || user.account}" 吗？此操作不可恢复！`,
      "删除确认",
      {
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await usersStore.deleteUser(user.id);
    await addOperationLog(`删除了用户：${user.nickname || user.account}`);
    ElMessage.success("用户删除成功");
    // 立即刷新列表
    await usersStore.fetchUsers();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败: " + (error.message || ""));
    }
  }
};

const submitForm = async () => {
  if (!form.value.account || !form.value.account.trim()) {
    return ElMessage.warning("账号不能为空");
  }

  try {
    await usersStore.updateUser(form.value);
    await addOperationLog(
      `更新了用户：${form.value.nickname || form.value.account}`
    );
    ElMessage.success("用户更新成功");
    dialogVisible.value = false;
    // 立即刷新列表
    await usersStore.fetchUsers();
  } catch (error) {
    ElMessage.error(`操作失败: ${error.message}`);
  }
};
</script>

<style lang="scss" scoped>
.users-management {
  padding: 20px;

  .header {
    margin-bottom: 20px;

    h1 {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--el-color-primary);
    }
  }

  .stat-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 20px;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 20px;

        .stat-icon {
          font-size: 40px;
        }

        h3 {
          margin: 0;
          color: var(--el-text-color-regular);
          font-weight: normal;
        }

        p {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
      }
    }
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
