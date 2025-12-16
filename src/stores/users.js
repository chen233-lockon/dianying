import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { userAPI } from "@/api/index.js";

export const useUsersStore = defineStore("users", () => {
  // 状态
  const users = ref([]); // 用户列表
  const userCount = ref(0); // 用户数量
  const loading = ref(false); // 加载状态
  const error = ref(null); // 错误信息
  const lastFetch = ref(null); // 上次获取数据时间

  // 获取用户数据
  const fetchUsers = async () => {
    try {
      loading.value = true;
      error.value = null;

      console.log("开始获取用户数据...");
      const response = await userAPI.getUsers();
      console.log("用户API原始响应:", response);
      console.log("response.data:", response.data);

      // 处理响应数据 - 兼容不同的数据结构
      let userData = [];
      if (Array.isArray(response.data)) {
        userData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        userData = response.data.data;
      } else if (response.data && Array.isArray(response.data.list)) {
        userData = response.data.list;
      } else {
        console.warn("未知的数据结构:", response);
        userData = [];
      }

      console.log("解析后的用户数据:", userData);
      console.log("用户数量:", userData.length);

      // 更新状态
      users.value = userData;
      userCount.value = userData.length;
      lastFetch.value = new Date();

      return userData;
    } catch (err) {
      error.value =
        err.response?.data?.message || err.message || "获取用户数据失败";
      console.error("用户数据获取失败:", err);
      users.value = [];
      userCount.value = 0;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 更新用户
  const updateUser = async (userData) => {
    try {
      loading.value = true;
      error.value = null;

      await userAPI.updateUser(userData.id, userData);

      // 更新本地状态
      const index = users.value.findIndex((u) => u.id === userData.id);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...userData };
      }

      return true;
    } catch (err) {
      error.value =
        err.response?.data?.message || err.message || "更新用户失败";
      console.error("用户更新失败:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 删除用户
  const deleteUser = async (userId) => {
    try {
      loading.value = true;
      error.value = null;

      await userAPI.deleteUser(userId);

      // 从本地状态中移除
      users.value = users.value.filter((u) => u.id !== userId);
      userCount.value = users.value.length;

      return true;
    } catch (err) {
      error.value =
        err.response?.data?.message || err.message || "删除用户失败";
      console.error("用户删除失败:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 计算属性
  const isLoading = computed(() => loading.value);
  const hasError = computed(() => error.value !== null);
  const errorMessage = computed(() => error.value);
  const count = computed(() => userCount.value);

  // 获取用户统计信息（用于仪表盘）
  const getStats = () => {
    return {
      count: userCount.value,
      lastFetch: lastFetch.value,
    };
  };

  return {
    // 状态
    users,
    userCount,

    // 计算属性
    isLoading,
    hasError,
    errorMessage,
    count,

    // 方法
    fetchUsers,
    updateUser,
    deleteUser,
    getStats,
  };
});
