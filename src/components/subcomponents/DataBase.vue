<template>
  <div class="movie-library">
    <div class="movie-container">
      <div class="content-container">
        <!-- 分类导航 -->
        <div class="category-nav">
          <el-menu
            :default-active="activeCategory"
            mode="horizontal"
            @select="handleCategoryChange"
          >
            <el-menu-item index="all">全部电影</el-menu-item>
            <el-menu-item
              v-for="category in categories"
              :key="category.id"
              :index="category.id.toString()"
            >
              {{ category.name }}
            </el-menu-item>
          </el-menu>
        </div>

        <!-- 电影列表 -->
        <div class="movie-list">
          <el-row :gutter="20">
            <el-col
              v-for="movie in paginatedMovies"
              :key="movie.id"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
            >
              <el-card :body-style="{ padding: '0px' }" shadow="hover">
                <img :src="movie.image" class="movie-image" />
                <div class="movie-info">
                  <span>{{ movie.name }}</span>
                  <div class="movie-meta">
                    <span>评分: {{ movie.score || "暂无评分" }}</span>
                    <span> 类型: {{ formatGenre(movie.genre) }} </span>
                  </div>

                  <div class="movie-actions">
                    <router-link
                      :to="'/home/database/detail/' + movie.id"
                      class="detail-link"
                    >
                      <button class="xiangqing">详情</button>
                    </router-link>
                    <el-button
                      size="mini"
                      @click="toggleFavorite(movie)"
                      :icon="isMovieFavorite(movie.id) ? 'StarFilled' : 'Star'"
                      :style="{
                        color: isMovieFavorite(movie.id) ? '#ffd700' : '',
                      }"
                      :loading="favoritesStore.loading"
                    >
                      {{ isMovieFavorite(movie.id) ? "已收藏" : "收藏" }}
                    </el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- 加载状态和无数据提示 -->
          <template v-if="loading">
            <div class="loading-container">
              <el-skeleton :rows="5" animated />
            </div>
          </template>
          <template v-else-if="paginatedMovies.length === 0">
            <div class="no-data">
              <el-empty description="暂无相关电影"></el-empty>
            </div>
          </template>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="pagination">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="pagination-button"
        >
          ← 上一页
        </button>
        <span class="page-info">
          第 <strong>{{ currentPage }}</strong> 页 / 共 {{ totalPages }} 页
        </span>
        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          class="pagination-button"
        >
          下一页 →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import { useFavoritesStore } from "@/stores/favorites";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { movieAPI, categoryAPI } from "@/api/index.js";

const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();
const router = useRouter();

// 响应式数据
const movies = ref([]);
const categories = ref([]);
const loading = ref(true);
const activeCategory = ref("all");
const currentPage = ref(1);
const itemsPerPage = 8;

// 查找当前选择的哪个分类,默认是全部
const filteredMovies = computed(() => {
  if (!movies.value || !Array.isArray(movies.value)) return [];
  return activeCategory.value === "all"
    ? movies.value
    : movies.value.filter(
        (movie) => movie.category_id === activeCategory.value
      );
});

//实现分页逻辑
const paginatedMovies = computed(() => {
  if (!filteredMovies.value || !Array.isArray(filteredMovies.value)) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredMovies.value.slice(start, start + itemsPerPage);
});

// 计算总页数
const totalPages = computed(() =>
  Math.ceil(filteredMovies.value.length / itemsPerPage)
);

// 获取电影和分类数据
const fetchData = async () => {
  try {
    const [moviesRes, categoriesRes] = await Promise.all([
      movieAPI.getMovies(),
      categoryAPI.getCategories(),
    ]);

    // 解析响应数据并更新响应式变量
    movies.value = moviesRes.data;
    categories.value = categoriesRes.data;
  } catch (error) {
    ElMessage.error("数据加载失败");
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

// 处理分类切换事件
const handleCategoryChange = (categoryId) => {
  activeCategory.value = categoryId;
  currentPage.value = 1;
};

const prevPage = () => currentPage.value > 1 && currentPage.value--;
const nextPage = () =>
  currentPage.value < totalPages.value && currentPage.value++;

// 格式化电影类型，将数组数据转化为/分割
const formatGenre = (genre) => {
  if (!genre) return "未知";
  return Array.isArray(genre) ? genre.join(" / ") : genre;
};

// 判断是否已收藏
const isMovieFavorite = (id) => favoritesStore.isFavorite(id);

// 切换收藏状态
const toggleFavorite = async (movie) => {
  if (!authStore.isLoggedIn) {
    ElMessage.warning("请先登录后再收藏");
    router.push("/qianlogin");
    return;
  }

  try {
    const isFavorite = isMovieFavorite(movie.id);
    await (isFavorite
      ? favoritesStore.removeFavorite(movie.id)
      : favoritesStore.addFavorite(movie));

    ElMessage.success(isFavorite ? "已取消收藏" : "收藏成功");
  } catch (error) {
    ElMessage.error("操作失败: " + error.message);
    console.error("Error toggling favorite:", error);
  }
};

// 监听收藏变化
watch(() => favoritesStore.favorites, { deep: true });

// 生命周期钩子
onMounted(() => {
  fetchData();
  if (authStore.isLoggedIn) {
    //更新用户收藏
    favoritesStore.fetchFavorites();
  }
});
</script>

<style scoped>
/* 原有样式保持不变 */
.movie-library {
  max-width: 1200px;
  margin: 0 auto;
}

.content-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.category-nav {
  margin-bottom: 20px;
}

.el-menu--horizontal {
  min-width: 100%;
  overflow-x: auto;
}

.el-menu-item {
  white-space: nowrap;
}

.movie-list {
  display: flex;
  flex-direction: column;
}

.movie-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.movie-info {
  padding: 15px;
}

.movie-info h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 12px;
  color: #666;
}

.movie-meta span {
  background-color: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.movie-actions {
  display: flex;
  justify-content: space-between;
}

.detail-link {
  color: #337ab7;
  text-decoration: none;
  font-size: 14px;
}

.detail-link:hover {
  text-decoration: underline;
}

.loading-container {
  padding: 20px 0;
}

.no-data {
  padding: 50px 0;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  padding: 25px 0;
  margin-top: 1rem;
}

.pagination-button {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

.pagination-button:not(:disabled):hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.page-info {
  color: #4b5563;
  font-size: 15px;
}

.page-info strong {
  color: #3b82f6;
  font-weight: 600;
}

.xiangqing {
  background-color: rgb(74, 113, 199);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.xiangqing:hover {
  background-color: rgb(29, 59, 206);
}

.xiangqing:active {
  background-color: rgb(33, 52, 120);
}
</style>
