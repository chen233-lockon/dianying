import axios from "axios";

// 创建axios实例
const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API请求错误:", error);
    return Promise.reject(error);
  }
);

// 电影相关接口
export const movieAPI = {
  // 获取电影列表
  getMovies: ({ page, pageSize } = {}) =>
    instance.get("/movies").then((response) => ({
      list: response.data,
      total: response.data.length,
    })),

  // 获取单个电影
  getMovie: (id) => instance.get(`/movies/${id}`),

  // 创建电影
  createMovie: (data) => instance.post("/movies", data),

  // 更新电影
  updateMovie: (id, data) => instance.put(`/movies/${id}`, data),

  // 删除电影
  deleteMovie: (id) => instance.delete(`/movies/${id}`),
};

// 分类相关接口
export const categoryAPI = {
  // 获取分类列表
  getCategories: () => instance.get("/categories"),

  // 获取单个分类
  getCategory: (id) => instance.get(`/categories/${id}`),

  // 创建分类
  createCategory: (data) => instance.post("/categories", data),

  // 更新分类
  updateCategory: (id, data) => instance.put(`/categories/${id}`, data),

  // 删除分类
  deleteCategory: (id) => instance.delete(`/categories/${id}`),
};

// 轮播图相关接口
export const carouselAPI = {
  // 获取轮播图列表
  getCarouselImages: () => instance.get("/carouselImages"),

  // 创建轮播图
  createCarouselImage: (data) => instance.post("/carouselImages", data),

  // 更新轮播图
  updateCarouselImage: (id, data) =>
    instance.put(`/carouselImages/${id}`, data),

  // 删除轮播图
  deleteCarouselImage: (id) => instance.delete(`/carouselImages/${id}`),
};

// 公告相关接口
export const announcementAPI = {
  // 获取公告列表
  getAnnouncements: () => instance.get("/announcements"),

  // 创建公告
  createAnnouncement: (data) => instance.post("/announcements", data),

  // 更新公告
  updateAnnouncement: (id, data) => instance.put(`/announcements/${id}`, data),

  // 删除公告
  deleteAnnouncement: (id) => instance.delete(`/announcements/${id}`),
};

// 热门电影相关接口
export const hotMovieAPI = {
  // 获取热门电影列表
  getHotMovies: () => instance.get("/hotMovies"),

  // 创建热门电影
  createHotMovie: (data) => instance.post("/hotMovies", data),

  // 更新热门电影
  updateHotMovie: (id, data) => instance.put(`/hotMovies/${id}`, data),

  // 删除热门电影
  deleteHotMovie: (id) => instance.delete(`/hotMovies/${id}`),
};

// 帖子相关接口
export const postAPI = {
  // 获取帖子列表
  getPosts: () => instance.get("/posts"),

  // 获取单个帖子
  getPost: (id) => instance.get(`/posts/${id}`),

  // 创建帖子
  createPost: (data) => instance.post("/posts", data),

  // 更新帖子
  updatePost: (id, data) => instance.put(`/posts/${id}`, data),

  // 删除帖子
  deletePost: (id) => instance.delete(`/posts/${id}`),
};

// 用户相关接口
export const userAPI = {
  // 获取用户列表
  getUsers: () => instance.get("/users"),

  // 获取单个用户
  getUser: (id) => instance.get(`/users/${id}`),

  // 创建用户
  createUser: (data) => instance.post("/users", data),

  // 更新用户
  updateUser: (id, data) => instance.put(`/users/${id}`, data),

  // 删除用户
  deleteUser: (id) => instance.delete(`/users/${id}`),
};

// 排行榜相关接口
export const rankingAPI = {
  // 获取排行榜列表
  getRankings: () => instance.get("/rankings"),

  // 获取单个排行榜项目
  getRanking: (id) => instance.get(`/rankings/${id}`),

  // 创建排行榜项目
  createRanking: (data) => instance.post("/rankings", data),

  // 更新排行榜项目
  updateRanking: (id, data) => instance.put(`/rankings/${id}`, data),

  // 删除排行榜项目
  deleteRanking: (id) => instance.delete(`/rankings/${id}`),
};

// 管理员相关接口
export const adminAPI = {
  // 获取管理员列表
  getAdmins: () => instance.get("/admininfo"),

  // 获取单个管理员
  getAdmin: (id) => instance.get(`/admininfo/${id}`),

  // 创建管理员
  createAdmin: (data) => instance.post("/admininfo", data),

  // 更新管理员
  updateAdmin: (id, data) => instance.put(`/admininfo/${id}`, data),

  // 删除管理员
  deleteAdmin: (id) => instance.delete(`/admininfo/${id}`),
};

// 操作日志相关接口
export const operationLogAPI = {
  // 获取操作日志列表
  getLogs: (params = {}) =>
    instance.get("/operationLogs", { params }).then((response) => ({
      list: response.data,
      total: response.data.length,
    })),

  // 获取单个日志
  getLog: (id) => instance.get(`/operationLogs/${id}`),

  // 创建操作日志
  createLog: (data) => instance.post("/operationLogs", data),

  // 删除操作日志
  deleteLog: (id) => instance.delete(`/operationLogs/${id}`),
};

// 上传相关接口
export const uploadAPI = {
  // 上传头像
  uploadAvatar: (formData) =>
    instance.post("/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // 上传通用文件
  uploadFile: (formData) =>
    instance.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

// 导出axios实例供其他地方使用
export default instance;
