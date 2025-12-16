<template>
  <!-- 模板部分保持不变 -->
  <div class="movie-homepage">
    <!-- 顶部布局：轮播图和公告 -->
    <div class="top-section">
      <!-- 轮播图区域 -->
      <div class="carousel-container">
        <el-carousel :interval="1000" arrow="always" height="400px">
          <el-carousel-item v-for="item in carouselImages" :key="item.id">
            <div class="carousel-item">
              <img :src="item.imageUrl" alt="" class="carousel-image" />
              <div class="carousel-overlay">
                <h2 class="carousel-title"></h2>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 公告区域 -->
      <div class="announcement-container">
        <h3>网站公告</h3>
        <ul class="announcement-list">
          <li v-for="(announcement, index) in announcements" :key="index">
            {{ announcement.content }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 最新热播区域 -->
    <div class="hot-movies-container">
      <h2>最新热播</h2>
      <div class="hot-movies-grid">
        <div
          v-for="(movie, index) in hotMovies"
          :key="index"
          class="movie-card"
        >
          <img :src="movie.poster" alt="电影海报" class="movie-poster" />
          <h3>{{ movie.title }}</h3>
          <p>{{ movie.highlights }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { carouselAPI, announcementAPI, hotMovieAPI } from "@/api/index.js";

// 响应式数据
const carouselImages = ref([]);
const announcements = ref([]);
const hotMovies = ref([]);

// 获取轮播图数据
const fetchCarouselData = async () => {
  try {
    const response = await carouselAPI.getCarouselImages();
    carouselImages.value = response.data;
  } catch (error) {
    ElMessage.error(`轮播图数据加载失败: ${error.message}`);
    console.error("Error fetching carousel images:", error);
  }
};

// 获取首页数据
const fetchHomepageData = async () => {
  try {
    const [announcementsRes, hotMoviesRes] = await Promise.all([
      announcementAPI.getAnnouncements(),
      hotMovieAPI.getHotMovies(),
    ]);

    announcements.value = announcementsRes.data;
    hotMovies.value = hotMoviesRes.data;
  } catch (error) {
    ElMessage.error(`首页数据加载失败: ${error.message}`);
    console.error("Error fetching homepage data:", error);
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchCarouselData();
  fetchHomepageData();
});
</script>

<style scoped>
.movie-homepage {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 顶部布局 */
.top-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.carousel-container {
  flex: 3;
  border-radius: 8px;
  overflow: hidden;
}

.carousel-item {
  position: relative;
  width: 100%;
  height: 400px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 20px;
  color: white;
}

.carousel-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* 公告区域 */
.announcement-container {
  flex: 1;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
}

.announcement-container h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.announcement-list {
  list-style: none;
  padding: 0;
}

.announcement-list li {
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

/* 最新热播区域 */
.hot-movies-container {
  margin-bottom: 30px;
}

.hot-movies-container h2 {
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.hot-movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.movie-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.movie-poster {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.movie-card h3 {
  margin: 10px;
  font-size: 16px;
}

.movie-card p {
  margin: 0 10px 10px;
  color: #666;
  font-size: 14px;
}
</style>
