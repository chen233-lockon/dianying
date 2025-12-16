# 前端 API 使用指南

## 概述

前端已统一使用 `src/api/index.js` 中的 API 封装来与后端通信。所有 HTTP 请求都通过 axios 实例，具有统一的配置、拦截器和错误处理。

---

## API 配置

### 基础配置

```javascript
// src/api/index.js
const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000, // 10秒超时
});
```

### 拦截器

#### 请求拦截器

- 用于添加认证 token 等信息
- 可以在此统一添加请求头

#### 响应拦截器

- 统一错误处理
- 自动打印错误日志
- 可扩展为统一的错误提示

---

## API 使用方式

### 导入方式

```javascript
// 导入所需的API对象
import {
  movieAPI,
  userAPI,
  postAPI,
  categoryAPI,
  carouselAPI,
  announcementAPI,
  hotMovieAPI,
  rankingAPI,
  adminAPI,
} from "@/api/index.js";
```

### 基本用法

```javascript
// 异步调用（推荐）
try {
  const response = await movieAPI.getMovies();
  console.log(response.data);
} catch (error) {
  console.error("获取失败:", error);
}

// 或使用Promise链式调用
movieAPI
  .getMovies()
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

---

## 各 API 对象详细说明

### 1. movieAPI - 电影接口

```javascript
// 获取电影列表（支持分页）
const { list, total } = await movieAPI.getMovies({ page: 1, pageSize: 10 });

// 获取单个电影
const movie = await movieAPI.getMovie(movieId);

// 创建电影
const newMovie = await movieAPI.createMovie({
  name: "电影名称",
  score: 8.5,
  image: "http://...",
  description: "描述",
  director: "导演",
  actors: ["演员1"],
  releaseDate: "2025-01-01",
  genre: ["动作"],
  explain: "详细说明",
  duration: 120,
  category_id: "1",
});

// 更新电影
await movieAPI.updateMovie(movieId, updatedData);

// 删除电影
await movieAPI.deleteMovie(movieId);
```

### 2. categoryAPI - 分类接口

```javascript
// 获取分类列表
const categories = await categoryAPI.getCategories();

// 获取单个分类
const category = await categoryAPI.getCategory(categoryId);

// 创建分类
await categoryAPI.createCategory({ name: "新分类" });

// 更新分类
await categoryAPI.updateCategory(categoryId, { name: "新分类名" });

// 删除分类
await categoryAPI.deleteCategory(categoryId);
```

### 3. userAPI - 用户接口

```javascript
// 获取用户列表
const users = await userAPI.getUsers();

// 获取单个用户
const user = await userAPI.getUser(userId);

// 创建用户（注册）
const newUser = await userAPI.createUser({
  account: "username",
  password: "password",
  avatar: "http://...",
  nickname: "昵称",
  gender: "male",
  age: 25,
  birthday: "2000-01-01",
  identity: "普通用户",
  hobbies: ["电影"],
  signature: "个人签名",
  collections: [],
  comments: [],
});

// 更新用户（编辑个人资料）
await userAPI.updateUser(userId, updatedUserData);

// 删除用户
await userAPI.deleteUser(userId);
```

### 4. postAPI - 帖子接口

```javascript
// 获取帖子列表
const posts = await postAPI.getPosts();

// 获取单个帖子
const post = await postAPI.getPost(postId);

// 创建帖子
const newPost = await postAPI.createPost({
  content: "<p>帖子内容HTML</p>",
  author: "作者名",
  time: "2025-12-16 10:30:00",
});

// 更新帖子
await postAPI.updatePost(postId, updatedPostData);

// 删除帖子
await postAPI.deletePost(postId);
```

### 5. carouselAPI - 轮播图接口

```javascript
// 获取轮播图列表
const images = await carouselAPI.getCarouselImages();

// 创建轮播图
await carouselAPI.createCarouselImage({
  imageUrl: "http://...",
});

// 更新轮播图
await carouselAPI.updateCarouselImage(imageId, {
  imageUrl: "http://...",
});

// 删除轮播图
await carouselAPI.deleteCarouselImage(imageId);
```

### 6. announcementAPI - 公告接口

```javascript
// 获取公告列表
const announcements = await announcementAPI.getAnnouncements();

// 创建公告
await announcementAPI.createAnnouncement({
  content: "公告内容",
});

// 更新公告
await announcementAPI.updateAnnouncement(announcementId, {
  content: "新公告内容",
});

// 删除公告
await announcementAPI.deleteAnnouncement(announcementId);
```

### 7. hotMovieAPI - 热门电影接口

```javascript
// 获取热门电影列表
const hotMovies = await hotMovieAPI.getHotMovies();

// 创建热门电影
await hotMovieAPI.createHotMovie({
  title: "电影标题",
  poster: "http://...",
  highlights: "亮点描述",
});

// 更新热门电影
await hotMovieAPI.updateHotMovie(movieId, updatedData);

// 删除热门电影
await hotMovieAPI.deleteHotMovie(movieId);
```

### 8. rankingAPI - 排行榜接口

```javascript
// 获取排行榜列表
const rankings = await rankingAPI.getRankings();

// 获取单个排行项
const ranking = await rankingAPI.getRanking(rankingId);

// 创建排行项
await rankingAPI.createRanking({
  title: "电影标题",
  src: "http://...",
  actors: ["演员1"],
  description: "描述",
  recommendationIndex: 9.7,
  comments: [],
});

// 更新排行项
await rankingAPI.updateRanking(rankingId, updatedData);

// 删除排行项
await rankingAPI.deleteRanking(rankingId);
```

### 9. adminAPI - 管理员接口

```javascript
// 获取管理员列表
const admins = await adminAPI.getAdmins();

// 获取单个管理员
const admin = await adminAPI.getAdmin(adminId);

// 创建管理员
await adminAPI.createAdmin({
  username: "admin",
  password: "password",
  avatar: "http://...",
  email: "admin@example.com",
  phone: "15520270102",
  registerDate: "2025-01-15",
});

// 更新管理员
await adminAPI.updateAdmin(adminId, updatedData);

// 删除管理员
await adminAPI.deleteAdmin(adminId);
```

---

## 在 Vue 组件中的实际使用示例

### 示例 1：HomePage.vue

```vue
<script setup>
import { ref, onMounted } from "vue";
import { carouselAPI, announcementAPI, hotMovieAPI } from "@/api/index.js";

const carouselImages = ref([]);
const announcements = ref([]);
const hotMovies = ref([]);

// 获取首页数据
const fetchHomepageData = async () => {
  try {
    // 并发请求多个数据
    const [carouselRes, announcementRes, hotMovieRes] = await Promise.all([
      carouselAPI.getCarouselImages(),
      announcementAPI.getAnnouncements(),
      hotMovieAPI.getHotMovies(),
    ]);

    carouselImages.value = carouselRes.data;
    announcements.value = announcementRes.data;
    hotMovies.value = hotMovieRes.data;
  } catch (error) {
    console.error("获取首页数据失败:", error);
  }
};

onMounted(() => {
  fetchHomepageData();
});
</script>

<template>
  <div class="home-page">
    <!-- 轮播图 -->
    <el-carousel v-for="image in carouselImages" :key="image.id">
      <img :src="image.imageUrl" />
    </el-carousel>

    <!-- 公告 -->
    <div class="announcements">
      <div v-for="(ann, index) in announcements" :key="index">
        {{ ann.content }}
      </div>
    </div>

    <!-- 热门电影 -->
    <div class="hot-movies">
      <div v-for="movie in hotMovies" :key="movie.id">
        <h3>{{ movie.title }}</h3>
        <p>{{ movie.highlights }}</p>
      </div>
    </div>
  </div>
</template>
```

### 示例 2：Communication.vue（论坛）

```vue
<script setup>
import { ref, onMounted } from "vue";
import { postAPI, userAPI } from "@/api/index.js";

const posts = ref([]);
const currentUser = ref(null);

// 获取当前用户
const getCurrentUser = async () => {
  try {
    if (authStore.user?.id) {
      const response = await userAPI.getUser(authStore.user.id);
      currentUser.value = response.data;
    }
  } catch (error) {
    console.error("获取用户失败:", error);
  }
};

// 获取帖子列表
const fetchPosts = async () => {
  try {
    const response = await postAPI.getPosts();
    posts.value = response.data;
  } catch (error) {
    console.error("获取帖子失败:", error);
  }
};

// 发布新帖子
const submitPost = async (postContent) => {
  try {
    const newPost = {
      content: postContent,
      author: currentUser.value.nickname,
      time: new Date().toLocaleString(),
    };

    const response = await postAPI.createPost(newPost);

    // 更新用户评论记录
    const updatedUser = {
      ...currentUser.value,
      comments: [
        ...(currentUser.value.comments || []),
        {
          postId: response.data.id,
          content: postContent,
          time: newPost.time,
        },
      ],
    };

    await userAPI.updateUser(currentUser.value.id, updatedUser);

    // 刷新帖子列表
    await fetchPosts();
  } catch (error) {
    console.error("发布帖子失败:", error);
  }
};

// 删除帖子
const deletePost = async (postId) => {
  try {
    await postAPI.deletePost(postId);
    // 更新用户评论
    currentUser.value.comments = currentUser.value.comments.filter(
      (c) => c.postId !== postId
    );
    await userAPI.updateUser(currentUser.value.id, currentUser.value);
    // 刷新列表
    await fetchPosts();
  } catch (error) {
    console.error("删除帖子失败:", error);
  }
};

onMounted(() => {
  fetchPosts();
  getCurrentUser();
});
</script>
```

### 示例 3：在 Store 中使用

```javascript
// src/stores/users.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { userAPI } from "@/api/index.js";

export const useUsersStore = defineStore("users", () => {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchUsers = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await userAPI.getUsers();
      users.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("获取用户失败:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
  };
});
```

---

## 错误处理最佳实践

### 方式 1：Try-Catch

```javascript
const handleDeleteUser = async (userId) => {
  try {
    await userAPI.deleteUser(userId);
    ElMessage.success("删除成功");
    // 刷新列表
    await fetchUsers();
  } catch (error) {
    ElMessage.error(`删除失败: ${error.message}`);
  }
};
```

### 方式 2：拦截器统一处理

```javascript
// 在api/index.js的响应拦截器中统一处理
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 统一错误提示
    const message = error.response?.data?.error || error.message;
    ElMessage.error(message);
    return Promise.reject(error);
  }
);
```

---

## 常见问题

### Q: 如何添加认证 token？

A: 在 api/index.js 的请求拦截器中添加：

```javascript
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Q: 如何自定义超时时间？

A: 在每个请求中指定：

```javascript
const response = await movieAPI.getMovies();
// 或者修改全局配置
instance.defaults.timeout = 20000;
```

### Q: 响应数据的结构是什么？

A: 所有 API 调用返回 axios 响应对象：

```javascript
{
  data: [...],      // 实际返回的数据
  status: 200,      // HTTP状态码
  statusText: "OK",
  headers: {...},
  config: {...}
}
```

### Q: 如何处理列表分页？

A:

```javascript
// movieAPI.getMovies()已内置分页逻辑
const { list, total } = await movieAPI.getMovies({
  page: 1,
  pageSize: 10,
});
```

---

## 性能优化建议

### 1. 使用并发请求

```javascript
// 不好的做法（串行请求）
const carousel = await carouselAPI.getCarouselImages();
const announcements = await announcementAPI.getAnnouncements();

// 好的做法（并发请求）
const [carousel, announcements] = await Promise.all([
  carouselAPI.getCarouselImages(),
  announcementAPI.getAnnouncements(),
]);
```

### 2. 添加请求缓存

```javascript
const cacheDuration = 5 * 60 * 1000; // 5分钟
let cachedMovies = null;
let cacheTime = null;

const getMoviesWithCache = async () => {
  if (cachedMovies && Date.now() - cacheTime < cacheDuration) {
    return cachedMovies;
  }

  const response = await movieAPI.getMovies();
  cachedMovies = response;
  cacheTime = Date.now();
  return response;
};
```

### 3. 取消冗余请求

```javascript
const controller = new AbortController();

const cancelRequest = () => {
  controller.abort();
};

// 在组件卸载时取消
onUnmounted(() => {
  cancelRequest();
});
```

---

## 总结

- ✅ 统一使用 `src/api/index.js` 中的 API 对象
- ✅ 遵循 axios 的 Promise 模式
- ✅ 使用 try-catch 处理错误
- ✅ 利用 Promise.all()进行并发请求
- ✅ 在拦截器中统一处理认证和错误

---

**文档版本**：1.0  
**最后更新**：2025 年 12 月 16 日
