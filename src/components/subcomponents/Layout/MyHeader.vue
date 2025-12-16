<template>
  <div class="layout-container">
    <!-- 头部导航栏 -->
    <header class="layout-header">
      <div class="layout-header-container">
        <!-- 左侧 logo 和 标题区域 -->
        <div class="layout-header-left">
          <img
            class="layout-header-left-img"
            src="@/assets/title_logo.jpg"
            alt="电影信息平台logo"
          />
          <h4 class="layout-header-left-title ml-3">电影信息平台</h4>
        </div>

        <!-- 导航菜单 -->
        <nav class="nav-menu">
          <ul class="menu">
            <li class="menu-item">
              <router-link to="/home/homepage">
                <el-icon><House /></el-icon>首页
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/home/movies">
                <el-icon><Memo /></el-icon>电影排行榜
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/home/database">
                <el-icon><Star /></el-icon>电影库
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/home/communication">论坛交流</router-link>
            </li>
            <li class="menu-item">
              <router-link to="/home/person">
                <el-icon><User /></el-icon>个人资料
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- 右侧按钮区域 -->
        <div class="layout-header-right">
          <!-- 搜索框带联想功能 -->
          <div class="search-box">
            <input
              type="text"
              placeholder="搜索想了解的电影"
              class="search-input"
              v-model="searchQuery"
              @input="handleInput"
              @keyup.enter="searchMovie"
              @click="showDropdown = true"
            />
            <button class="search-btn" @click="searchMovie">
              <el-icon><Search /></el-icon>
            </button>

            <!-- 联想下拉框 -->
            <div
              v-if="showDropdown && filteredMovies.length > 0"
              class="autocomplete-dropdown"
            >
              <div
                v-for="movie in filteredMovies"
                :key="movie.id"
                class="autocomplete-item"
                @click="selectMovie(movie)"
              >
                <span v-html="highlightMatch(movie.name, searchQuery)"></span>
              </div>
            </div>
          </div>

          <!-- 登录状态 -->
          <el-dropdown v-if="authStore.isLoggedIn && authStore.user">
            <span class="el-dropdown-link user-dropdown">
              <el-avatar
                class="avatar"
                size="small"
                :src="authStore.user?.avatar || defaultAvatar"
              />
              <span class="nickname">{{
                authStore.user?.nickname || "用户"
              }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item class="ziliao" @click="transpage">
                  <el-icon><User /></el-icon>个人资料
                </el-dropdown-item>
                <el-dropdown-item class="btn btn-light" @click="onLogout">
                  <el-icon><Close /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 未登录状态 - 显示登录按钮 -->
          <el-button
            v-else
            @click="gotoLogin"
            type="primary"
            class="login-button"
          >
            请先登录
          </el-button>
          <button @click="gotoAdminLogin" class="admin-login-btn">
            登录后台
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="layout-main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { movieAPI } from "@/api/index.js";
import { useAuthStore } from "@/stores/auth";
import defaultAvatar from "@/assets/title_logo.jpg";

const router = useRouter();
const searchQuery = ref("");
const filteredMovies = ref([]);
const showDropdown = ref(false);
const movies = ref([]);
const authStore = useAuthStore();

// 初始化检查用户状态
const initializeAuth = () => {
  const storedUser = localStorage.getItem("userInfo");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (storedUser && isLoggedIn) {
    try {
      authStore.setUser(JSON.parse(storedUser));
      authStore.setIsLoggedIn(true);
    } catch (e) {
      console.error("Failed to parse user data:", e);
      clearAuthData();
    }
  } else {
    clearAuthData();
  }
};

const clearAuthData = () => {
  authStore.setUser(null);
  authStore.setIsLoggedIn(false);
  localStorage.removeItem("userInfo");
  localStorage.removeItem("isLoggedIn");
};

// 点击外部关闭下拉框
const handleClickOutside = (event) => {
  const searchBox = event.target.closest(".search-box");
  if (!searchBox) {
    showDropdown.value = false;
  }
};

// 获取所有电影数据
onMounted(async () => {
  initializeAuth();

  try {
    const response = await movieAPI.getMovies();
    movies.value = response.list;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }

  // 添加全局点击事件监听
  document.addEventListener("click", handleClickOutside);
});

// 清理事件监听
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// 模糊搜索函数 - 只搜索电影名称
const handleInput = () => {
  if (searchQuery.value.trim() === "") {
    showDropdown.value = false;
    filteredMovies.value = [];
    return;
  }

  const query = searchQuery.value.toLowerCase().trim();

  // 模糊搜索：只匹配电影名称
  filteredMovies.value = movies.value
    .filter((movie) => movie.name?.toLowerCase().includes(query))
    .slice(0, 8); // 限制最多显示8条结果

  showDropdown.value = filteredMovies.value.length > 0;
};

// 选择电影
const selectMovie = (movie) => {
  router.push(`/home/database/detail/${movie.id}`);
  searchQuery.value = "";
  showDropdown.value = false;
};

// 高亮匹配的文本
const highlightMatch = (text, query) => {
  if (!text || !query) return text;

  const regex = new RegExp(`(${query.trim()})`, "gi");
  return text.replace(regex, '<span class="highlight">$1</span>');
};

// 搜索电影（按回车键）
const searchMovie = () => {
  if (searchQuery.value.trim() === "") return;

  // 如果只有一个结果，直接跳转
  if (filteredMovies.value.length === 1) {
    selectMovie(filteredMovies.value[0]);
    return;
  }

  // 优先精确匹配
  const exactMatch = filteredMovies.value.find(
    (movie) =>
      movie.name.toLowerCase() === searchQuery.value.toLowerCase().trim()
  );

  if (exactMatch) {
    selectMovie(exactMatch);
  } else if (filteredMovies.value.length > 0) {
    // 如果有多个结果，选择第一个
    selectMovie(filteredMovies.value[0]);
  } else {
    alert("未找到相关电影！");
  }
};

const onLogout = () => {
  clearAuthData();
  router.push("/qianlogin");
};

const transpage = () => {
  router.push("/home/person");
};

const gotoLogin = () => {
  router.push("/qianlogin");
};

const gotoAdminLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
/* 基础布局样式 */
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 头部样式 */
.layout-header {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.layout-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
}

/* 左侧区域 */
.layout-header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.layout-header-left-img {
  height: 36px;
  width: auto;
}

.layout-header-left-title {
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  align-items: center;
}

.menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 5px;
}

.menu-item a {
  color: #606266;
  text-decoration: none;
  display: flex;
  align-items: center;
  height: 100%;
  transition: color 0.3s;
}

.menu-item a:hover {
  color: #409eff;
}

.menu-item a.router-link-active {
  color: #409eff;
  font-weight: 500;
}

/* 右侧区域 */
.layout-header-right {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

/* 搜索框 */
.search-box {
  position: relative;
  margin-right: 24px;
}

.search-input {
  width: 200px;
  padding: 8px 16px 8px 36px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.search-btn {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
}

/* 联想下拉框 */
.autocomplete-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.autocomplete-item {
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
  color: #303133;
}

.autocomplete-item:hover {
  background-color: #f5f7fa;
}

/* 高亮匹配文本 */
.autocomplete-item :deep(.highlight) {
  color: #409eff;
  font-weight: 600;
  background-color: rgba(64, 158, 255, 0.1);
  padding: 0 2px;
  border-radius: 2px;
}

/* 滚动条样式 */
.autocomplete-dropdown::-webkit-scrollbar {
  width: 6px;
}

.autocomplete-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.autocomplete-dropdown::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.autocomplete-dropdown::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 用户相关样式 */
.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.avatar {
  cursor: pointer;
  transition: transform 0.2s;
  background-color: #f0f4f8;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a0aec0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>');
  background-size: 50%;
  background-position: center;
  background-repeat: no-repeat;
}

.avatar:hover {
  transform: scale(1.05);
}

.nickname {
  margin-left: 8px;
  font-size: 14px;
  color: #333;
}

/* 按钮样式 */
.login-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  background-color: #409eff;
  color: white;
  border: none;
  transition: all 0.3s;
}

.login-button:hover {
  background-color: #66b1ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.admin-login-btn {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  background-color: #424441;
  color: white;
  border: none;
  margin-left: 12px;
  transition: all 0.3s;
  cursor: pointer;
}

.admin-login-btn:hover {
  background-color: #090a08;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(6, 14, 3, 0.3);
}

/* 主内容区域 */
.layout-main {
  flex: 1;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .layout-header-container {
    padding: 0 16px !important;
  }

  .menu-item {
    margin: 0 4px;
  }

  .menu-item a {
    padding: 6px 8px;
    font-size: 13px;
  }

  .search-box {
    margin-right: 16px;
  }

  .search-input {
    width: 160px;
  }

  .layout-main {
    padding: 0 16px;
  }
}

@media (max-width: 992px) {
  .layout-header-left-title {
    display: none;
  }

  .menu-item {
    margin: 0 2px !important;
  }

  .menu-item a {
    padding: 4px 6px !important;
    font-size: 12px !important;
  }

  .menu-item .el-icon {
    font-size: 14px !important;
  }

  .search-input {
    width: 120px !important;
  }
}

@media (max-width: 768px) {
  .layout-header-container {
    flex-wrap: wrap;
    height: auto;
    padding: 8px 16px !important;
  }

  .layout-header-left,
  .nav-menu,
  .layout-header-right {
    flex: 0 0 100%;
    justify-content: center;
    margin: 4px 0;
  }

  .nav-menu {
    order: 1;
  }

  .menu {
    justify-content: center;
  }

  .search-box {
    margin-right: 0;
    width: 100%;
  }

  .search-input {
    width: 100% !important;
  }

  .layout-main {
    margin: 12px auto;
    padding: 0 12px;
    border-radius: 0;
  }
}
</style>
