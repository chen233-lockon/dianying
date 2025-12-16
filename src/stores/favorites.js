import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import { userAPI } from "@/api/index.js";

export const useFavoritesStore = defineStore("favorites", () => {
  const authStore = useAuthStore();
  // 存储用户收藏的电影ID数组
  const favorites = ref([]);
  // 存储加载状态
  const loading = ref(false);

  // 获取当前用户ID
  const getCurrentUserId = () => {
    return authStore.user?.id || null;
  };

  // 获取用户收藏
  async function fetchFavorites() {
    loading.value = true;
    try {
      const userId = getCurrentUserId();
      if (userId) {
        const response = await userAPI.getFavorites(userId);
        // 更新本地收藏数据（只存储电影ID）
        favorites.value = response.data.favorites || [];
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      if (error.response?.status === 404) {
        favorites.value = [];
        console.warn("User not found, clearing favorites");
      }
    } finally {
      loading.value = false;
    }
  }

  // 添加收藏
  async function addFavorite(movie) {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      // 调用后端API添加收藏
      const response = await userAPI.addFavorite(userId, movie.id);
      // 更新本地收藏列表
      favorites.value = response.data.favorites || [];
      return true;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  }

  // 取消收藏
  async function removeFavorite(movieId) {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      // 调用后端API取消收藏
      const response = await userAPI.removeFavorite(userId, movieId);
      // 更新本地收藏列表
      favorites.value = response.data.favorites || [];
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  }

  // 判断是否已收藏（现在favorites是ID数组）
  const isFavorite = (id) => {
    return favorites.value.includes(id);
  };

  return {
    favorites,
    loading,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
});
