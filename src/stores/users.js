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

      const response = await userAPI.getUsers();

      // 更新状态
      users.value = response.data;
      userCount.value = response.data.length;
      lastFetch.value = new Date();

      return response.data;
    } catch (err) {
      error.value =
        err.response?.data?.message || err.message || "获取用户数据失败";
      console.error("用户数据获取失败:", err);
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
    getStats,
  };
});
