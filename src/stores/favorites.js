import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import { userAPI } from "@/api/index.js";

export const useFavoritesStore = defineStore("favorites", () => {
  const authStore = useAuthStore();
  // 存储用户收藏
  const favorites = ref([]);
  // 存储加载状态
  const loading = ref(false);

  // 获取当前用户数据
  const getCurrentUserData = () => {
    // 如果authStore中没有用户数据，则返回null
    if (!authStore.user) return null;
    // 返回用户id和收藏
    return {
      userId: authStore.user.id,
      collections: authStore.user.collections || [],
    };
  };

  // 更新用户收藏
  const updateUserCollections = async (collections) => {
    // 获取当前用户数据
    const user = getCurrentUserData();
    if (!user) return;

    try {
      // 使用userAPI更新用户收藏
      const response = await userAPI.updateUser(user.userId, { collections });

      // 更新本地数据
      authStore.user.collections = collections;
      favorites.value = collections;
      return response.data;
    } catch (error) {
      console.error("Error updating favorites:", error);
      throw error;
    }
  };

  // 获取用户收藏
  async function fetchFavorites() {
    // 设置加载状态为true
    loading.value = true;
    try {
      // 获取当前用户数据
      const user = getCurrentUserData();
      if (user) {
        const response = await userAPI.getUser(user.userId);
        // 更新本地收藏数据
        favorites.value = response.data.collections || [];
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      // 如果是404错误，说明用户不存在，清空收藏
      if (error.response?.status === 404) {
        favorites.value = [];
        console.warn("User not found, clearing favorites");
      }
      // 不再抛出错误，避免阻断应用运行
    } finally {
      // 设置加载状态为false
      loading.value = false;
    }
  }

  // 添加收藏
  async function addFavorite(movie) {
    try {
      // 获取当前用户数据
      const user = getCurrentUserData();
      // 如果没有用户数据，则返回
      if (!user) return;

      // 更新用户收藏
      await updateUserCollections([...user.collections, movie]);
      return true;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  }

  // 取消收藏
  async function removeFavorite(movieId) {
    try {
      // 获取当前用户数据
      const user = getCurrentUserData();
      // 如果没有用户数据，则返回
      if (!user) return;

      // 过滤掉要取消收藏的movieId
      const updated = user.collections.filter((f) => f.id !== movieId);
      await updateUserCollections(updated);
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  }

  // 检查是否已收藏
  function isFavorite(movieId) {
    return favorites.value.some((f) => f.id === movieId);
    // 判断favorites中是否存在movieId
  }

  return {
    favorites,
    loading,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
});
