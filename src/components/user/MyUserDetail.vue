<template>
  <div class="movie-detail-container" v-if="movie">
    <div class="movie-header">
      <h1 class="movie-title">{{ movie.name }}</h1>
      <div class="score-container">
        <div class="score">评分：{{ movie.score }}</div>
      </div>
    </div>

    <div class="movie-content">
      <div class="poster-container">
        <img :src="movie.image" class="movie-poster-detail" />
      </div>

      <div class="movie-details">
        <div class="detail-section">
          <h2 class="section-title">剧情简介</h2>
          <p v-if="movie.description">{{ movie.description }}</p>
        </div>

        <div class="detail-section">
          <h2 class="detail-section">演职员表</h2>
          <p v-if="movie.director">导演: {{ movie.director }}</p>
          <p v-if="movie.actors">主演: {{ movie.actors.join(", ") }}</p>
        </div>

        <div class="detail-section">
          <h2 class="detail-section">基本信息</h2>
          <p v-if="movie.releaseDate">上映日期: {{ movie.releaseDate }}</p>
          <p v-if="movie.genre">类型: {{ movie.genre.join(", ") }}</p>
          <p v-if="movie.duration">时长: {{ movie.duration }}分钟</p>
        </div>

        <!-- 收藏按钮 -->
        <div class="action-buttons">
          <el-button
            size="mini"
            @click="toggleFavorite"
            :icon="isFavorite ? 'Star' : 'StarFilled'"
            :style="{
              color: isFavorite ? '#ffd700' : '',
            }"
          >
            {{ isFavorite ? "已收藏" : "收藏" }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 新增的电影剧情介绍部分 -->
    <div class="movie-explanation" v-if="movie.explain">
      <h2 class="section-title">深度解析</h2>
      <div class="explanation-content">
        {{ movie.explain }}
      </div>
    </div>
  </div>
  <div v-else class="loading">加载中...</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { movieAPI, userAPI } from "@/api/index.js";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const movie = ref(null);
const favorites = ref([]);

// 计算属性
const isFavorite = computed(() =>
  favorites.value.some((fav) => fav.id === movie.value?.id)
);

// 获取电影详情
const fetchMovieDetails = async () => {
  try {
    const { data } = await movieAPI.getMovie(route.params.id);
    movie.value = data;
  } catch (error) {
    console.error("获取电影详情失败:", error);
    ElMessage.error("无法加载电影详情");
  }
};

// 获取用户收藏
const fetchFavorites = async () => {
  try {
    const { data: users } = await userAPI.getUsers();
    const currentUser = users.find(
      (user) => user.account === authStore.user?.account
    );
    favorites.value = currentUser?.collections || [];
  } catch (error) {
    console.error("获取收藏失败:", error);
  }
};

// 更新收藏到数据库
const updateFavoritesInDB = async () => {
  try {
    const { data: users } = await userAPI.getUsers();
    const currentUser = users.find(
      (user) => user.account === authStore.user?.account
    );

    if (currentUser) {
      await userAPI.updateUser(currentUser.id, {
        ...currentUser,
        collections: favorites.value,
      });
    }
  } catch (error) {
    console.error("更新收藏失败:", error);
    ElMessage.error("操作失败，请重试");
  }
};

// 切换收藏状态
const toggleFavorite = async () => {
  if (!authStore.isLoggedIn) {
    ElMessage.warning("请先登录后再收藏");
    router.push("/qianlogin");
    return;
  }

  if (!movie.value) return;

  try {
    const index = favorites.value.findIndex((fav) => fav.id === movie.value.id);

    if (index !== -1) {
      favorites.value.splice(index, 1);
      ElMessage.success("已取消收藏");
    } else {
      favorites.value.push({
        id: movie.value.id,
        name: movie.value.name,
        score: movie.value.score,
        image: movie.value.image,
        description: movie.value.description || "暂无描述",
        director: movie.value.director || "未知导演",
        actors: movie.value.actors || [],
        releaseDate: movie.value.releaseDate || "未知日期",
        genre: movie.value.genre,
        duration: movie.value.duration || 0,
      });
      ElMessage.success("收藏成功");
    }

    await updateFavoritesInDB();
  } catch (error) {
    console.error("收藏操作失败:", error);
    ElMessage.error("操作失败，请重试");
  }
};

// 初始化
onMounted(async () => {
  await fetchMovieDetails();
  if (authStore.isLoggedIn) await fetchFavorites();
});
</script>

<style scoped>
.movie-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
}

.movie-header {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.movie-title {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 15px;
}

.score-container {
  display: flex;
  align-items: center;
}

.score {
  font-size: 24px;
  color: #f59e0b;
  font-weight: bold;
  margin-right: 15px;
}

.movie-content {
  display: flex;
  gap: 30px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.poster-container {
  flex: 0 0 300px;
  max-width: 300px;
}

.movie-poster-detail {
  width: 100%;
  height: 450px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.movie-details {
  flex: 1;
  min-width: 300px;
}

.detail-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 15px;
  position: relative;
  padding-left: 10px;
}

.section-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  background-color: #1890ff;
  border-radius: 2px;
}

.action-buttons {
  margin-top: 30px;
}

.action-buttons .el-button {
  padding: 12px 30px;
  font-size: 16px;
}

/* 电影剧情介绍样式 */
.movie-explanation {
  margin-top: 40px;
  padding: 25px;
  background-color: #f9f9f9;
  border-radius: 8px;
  line-height: 1.8;
}

.explanation-content {
  font-size: 16px;
  color: #333;
  white-space: pre-line;
}

@media (max-width: 768px) {
  .movie-content {
    flex-direction: column;
  }

  .poster-container {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .movie-explanation {
    padding: 15px;
    margin-top: 30px;
  }
}
</style>
