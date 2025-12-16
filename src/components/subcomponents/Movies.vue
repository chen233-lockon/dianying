<template>
  <div>
    <div class="movie-list">
      <div
        class="movie-item"
        v-for="(movie, index) in paginatedMovies"
        :key="movie.id"
      >
        <!-- 排名 -->
        <div class="rank">
          {{ (currentPage - 1) * itemsPerPage + index + 1 }}
        </div>

        <!-- 图片 -->
        <div class="movie-image">
          <img v-lazy="getImageUrl(movie.src)" alt="电影图片" />
        </div>

        <!-- 电影信息 -->
        <div class="movie-info">
          <!-- 电影名字 -->
          <h3>{{ movie.title }}</h3>

          <!-- 电影演员 -->
          <p class="actors">演员: {{ movie.actors.join("，") }}</p>

          <!-- 电影简介 -->
          <div class="description">
            <span>{{ movie.description }}</span>
          </div>

          <div class="count">
            <span>评分: {{ movie.recommendationIndex }}</span>
          </div>
        </div>

        <!-- 用户评论和评分 -->
        <div class="movie-comments">
          <h4>用户评论</h4>
          <div
            v-for="(comment, commentIndex) in movie.comments"
            :key="commentIndex"
            class="comment-item"
          >
            <p class="comment-text">{{ comment.text }}</p>
            <p class="comment-rating">评分: {{ comment.rating }}</p>
          </div>
        </div>
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
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
// 更新Movies.vue中的排行榜数据调用
import axios from "axios";
import { rankingAPI } from "@/api/index.js";

// 响应式数据
const rankings = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;

//排行榜数据分页
const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return rankings.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(rankings.value.length / itemsPerPage);
});

// 获取排行榜数据
const fetchRankings = async () => {
  try {
    const response = await rankingAPI.getRankings();
    rankings.value = response.data;
  } catch (error) {
    console.error("Error fetching rankings:", error);
  }
};

// 获取图片URL
const getImageUrl = (src) => src;

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

// 生命周期钩子
onMounted(fetchRankings);
</script>

<style scoped>
.movie-list {
  width: 1024px;
  display: flex;
  margin-left: 200px;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.movie-item {
  display: flex;
  align-items: flex-start;
  border: 1px solid #e0e0e0;
  padding: 15px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.movie-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.description {
  width: 600px;
  margin-bottom: 10px;
  font-weight: 400;
  line-height: 40px;
  margin-top: 10px;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

.rank {
  font-size: 24px;
  font-weight: bold;
  color: #ff6f61;
  margin-right: 20px;
  flex-shrink: 0;
}

.movie-image img {
  width: 120px;
  height: auto;
  margin-right: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.movie-info {
  flex: 1;
}

.movie-info .count span {
  margin-top: 10px;
}

.movie-info h3 {
  margin: 0 0 10px;
  font-size: 22px;
  color: #333;
  margin-bottom: 10px;
}

.count {
  margin: 15px 0;
}

.movie-info .actors {
  margin: 0 0 10px;
  color: #666;
  font-size: 14px;
}

button {
  margin-top: 5px;
  padding: 5px 10px;
  font-size: 14px;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #0056b3;
}

.movie-comments {
  width: 300px;
  padding: 2px;
  border-left: 1px solid #e0e0e0;
}

.movie-comments h3 {
  margin-bottom: 5px;
  font-size: 10px;
  color: #333;
}

.comment-item {
  margin-bottom: 5px;
  padding: 2px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.comment-text {
  margin: 0 0 1px;
  color: #666;
}

.comment-rating {
  font-weight: bold;
  color: #ff6f61;
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
</style>
