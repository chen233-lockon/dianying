import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import { userAPI } from "@/api/index.js";

export const useFavoritesStore = defineStore("favorites", () => {
  const authStore = useAuthStore();
  // 存储用户收藏的完整电影信息（用于展示）
  const favorites = ref([]);
  // 存储用户收藏的电影ID数组（用于判断是否已收藏）
  const favoriteIds = ref([]);
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
        // 更新本地收藏数据（包含完整电影信息和ID数组）
        favorites.value = response.data.favorites || [];
        favoriteIds.value = response.data.favoriteIds || [];
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      if (error.response?.status === 404) {
        favorites.value = [];
        favoriteIds.value = [];
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
      await userAPI.addFavorite(userId, movie.id);
      // 重新获取收藏列表以保持数据同步
      await fetchFavorites();
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
      await userAPI.removeFavorite(userId, movieId);
      // 重新获取收藏列表以保持数据同步
      await fetchFavorites();
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  }

  // 判断是否已收藏（使用favoriteIds数组）
  const isFavorite = (id) => {
    return favoriteIds.value.includes(id);
  };

  return {
    favorites,
    favoriteIds,
    loading,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
});
