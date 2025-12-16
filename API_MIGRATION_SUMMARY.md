# 项目数据迁移和接口统一总结

## 一、数据迁移状态检查结果

### 已迁移到 MySQL 数据库：

- ✅ **categories** (分类表) - 已完全迁移
- ✅ **movies** (电影表) - 已完全迁移

### 完新迁移到 MySQL 数据库的数据：

- ✅ **carousel_images** (轮播图) - 新创建
- ✅ **announcements** (公告) - 新创建
- ✅ **hot_movies** (热门电影) - 新创建
- ✅ **posts** (帖子/论坛) - 新创建
- ✅ **users** (用户) - 新创建
- ✅ **rankings** (电影排行榜) - 新创建
- ✅ **admininfo** (管理员信息) - 新创建

---

## 二、后端接口实现

### 创建的新 API 路由文件：

| 路由文件                | 端点            | 功能描述             |
| ----------------------- | --------------- | -------------------- |
| carousel-mysql.cjs      | /carouselImages | 轮播图 CRUD 操作     |
| announcements-mysql.cjs | /announcements  | 公告 CRUD 操作       |
| hot-movies-mysql.cjs    | /hotMovies      | 热门电影 CRUD 操作   |
| posts-mysql.cjs         | /posts          | 帖子/论坛 CRUD 操作  |
| users-mysql.cjs         | /users          | 用户 CRUD 操作       |
| rankings-mysql.cjs      | /rankings       | 排行榜 CRUD 操作     |
| admininfo-mysql.cjs     | /admininfo      | 管理员信息 CRUD 操作 |

### RESTful API 规范：

所有 API 均遵循 RESTful 设计模式：

```
GET    /resource           - 获取资源列表
GET    /resource/:id       - 获取单个资源
POST   /resource           - 创建资源
PUT    /resource/:id       - 更新资源
DELETE /resource/:id       - 删除资源
```

---

## 三、前端接口统一封装

### API 封装文件位置：

- **src/api/index.js** - 统一的 axios 二次封装

### API 对象列表：

```javascript
// 核心API对象导出
export const movieAPI        // 电影接口
export const categoryAPI     // 分类接口
export const carouselAPI     // 轮播图接口
export const announcementAPI // 公告接口
export const hotMovieAPI     // 热门电影接口
export const postAPI         // 帖子接口
export const userAPI         // 用户接口
export const rankingAPI      // 排行榜接口
export const adminAPI        // 管理员接口
```

### axios 配置特性：

```javascript
// 基础配置
- baseURL: http://localhost:3000
- timeout: 10000ms

// 请求拦截器
- 可用于添加token等认证信息

// 响应拦截器
- 统一错误处理
- 自动日志输出
```

---

## 四、更新的前端组件和 Store

### 已更新的组件（共 11 个）：

| 组件/Store 文件                                  | 更新内容                               |
| ------------------------------------------------ | -------------------------------------- |
| src/api/index.js                                 | ✅ 完整的 API 封装                     |
| src/stores/auth.js                               | ✅ 使用 userAPI 替换 axios             |
| src/stores/users.js                              | ✅ 使用 userAPI 替换 axios             |
| src/stores/user.js                               | ✅ 使用 adminAPI 替换 axios            |
| src/components/subcomponents/HomePage.vue        | ✅ 使用 carouselAPI 和 announcementAPI |
| src/components/subcomponents/Communication.vue   | ✅ 使用 postAPI 和 userAPI             |
| src/components/subcomponents/qianlogin.vue       | ✅ 使用 userAPI                        |
| src/components/subcomponents/register.vue        | ✅ 使用 userAPI                        |
| src/components/subcomponents/UserCenter.vue      | ✅ 使用 userAPI                        |
| src/components/subcomponents/Movies.vue          | ✅ 使用 rankingAPI                     |
| src/components/subcomponents/Layout/MyHeader.vue | ✅ 使用 movieAPI                       |
| src/components/user/MyUserDetail.vue             | ✅ 使用 movieAPI 和 userAPI            |
| src/components/backend/Login.vue                 | ✅ 使用 adminAPI                       |

---

## 五、数据库初始化

### init-mysql.cjs 更新内容：

1. **新增表结构定义** - 为所有未迁移的数据添加表结构
2. **数据导入逻辑** - 从 db.json 自动导入数据到对应的 MySQL 表
3. **JSON 字段支持** - 复杂数据结构使用 JSON 类型存储

### 支持的数据导入：

- ✅ 轮播图数据
- ✅ 公告数据
- ✅ 热门电影数据
- ✅ 帖子数据
- ✅ 用户数据
- ✅ 排行榜数据
- ✅ 管理员信息

---

## 六、使用说明

### 前端导入 API 的方式：

```javascript
// 方式1：导入单个API对象
import { userAPI, postAPI } from "@/api/index.js";

// 方式2：导入所有API对象（推荐）
import {
  movieAPI,
  userAPI,
  postAPI,
  rankingAPI,
  adminAPI,
} from "@/api/index.js";

// 使用示例
const users = await userAPI.getUsers();
const user = await userAPI.getUser(id);
await userAPI.createUser(data);
await userAPI.updateUser(id, data);
await userAPI.deleteUser(id);
```

### API 调用示例：

```javascript
// 获取电影列表
const response = await movieAPI.getMovies();
console.log(response.list); // 电影数组
console.log(response.total); // 总数

// 获取用户列表
const users = await userAPI.getUsers();
const userData = users.data;

// 创建帖子
await postAPI.createPost({
  content: "帖子内容",
  author: "作者名",
  time: "2025-12-16",
});
```

---

## 七、后端服务启动

### 初始化数据库：

```bash
node server/init-mysql.cjs
```

### 启动服务器：

```bash
node server/index-mysql.cjs
```

### 服务器在以下地址运行：

- 主机：http://localhost:3000
- 健康检查：http://localhost:3000/health

---

## 八、技术栈总结

### 后端：

- **框架**：Express.js
- **数据库**：MySQL
- **驱动**：mysql2/promise
- **中间件**：CORS, body-parser
- **API 风格**：RESTful

### 前端：

- **框架**：Vue 3 (Composition API)
- **HTTP 客户端**：Axios
- **状态管理**：Pinia
- **API 封装方式**：二次封装 axios

---

## 九、API 端点完整列表

| 资源     | 端点                | 方法   | 说明             |
| -------- | ------------------- | ------ | ---------------- |
| 电影     | /movies             | GET    | 获取电影列表     |
|          | /movies/:id         | GET    | 获取单个电影     |
|          | /movies             | POST   | 创建电影         |
|          | /movies/:id         | PUT    | 更新电影         |
|          | /movies/:id         | DELETE | 删除电影         |
| 分类     | /categories         | GET    | 获取分类列表     |
|          | /categories/:id     | GET    | 获取单个分类     |
|          | /categories         | POST   | 创建分类         |
|          | /categories/:id     | PUT    | 更新分类         |
|          | /categories/:id     | DELETE | 删除分类         |
| 轮播图   | /carouselImages     | GET    | 获取轮播图列表   |
|          | /carouselImages/:id | GET    | 获取单个轮播图   |
|          | /carouselImages     | POST   | 创建轮播图       |
|          | /carouselImages/:id | PUT    | 更新轮播图       |
|          | /carouselImages/:id | DELETE | 删除轮播图       |
| 公告     | /announcements      | GET    | 获取公告列表     |
|          | /announcements/:id  | GET    | 获取单个公告     |
|          | /announcements      | POST   | 创建公告         |
|          | /announcements/:id  | PUT    | 更新公告         |
|          | /announcements/:id  | DELETE | 删除公告         |
| 热门电影 | /hotMovies          | GET    | 获取热门电影列表 |
|          | /hotMovies/:id      | GET    | 获取单个热门电影 |
|          | /hotMovies          | POST   | 创建热门电影     |
|          | /hotMovies/:id      | PUT    | 更新热门电影     |
|          | /hotMovies/:id      | DELETE | 删除热门电影     |
| 帖子     | /posts              | GET    | 获取帖子列表     |
|          | /posts/:id          | GET    | 获取单个帖子     |
|          | /posts              | POST   | 创建帖子         |
|          | /posts/:id          | PUT    | 更新帖子         |
|          | /posts/:id          | DELETE | 删除帖子         |
| 用户     | /users              | GET    | 获取用户列表     |
|          | /users/:id          | GET    | 获取单个用户     |
|          | /users              | POST   | 创建用户         |
|          | /users/:id          | PUT    | 更新用户         |
|          | /users/:id          | DELETE | 删除用户         |
| 排行榜   | /rankings           | GET    | 获取排行榜列表   |
|          | /rankings/:id       | GET    | 获取单个排行项   |
|          | /rankings           | POST   | 创建排行项       |
|          | /rankings/:id       | PUT    | 更新排行项       |
|          | /rankings/:id       | DELETE | 删除排行项       |
| 管理员   | /admininfo          | GET    | 获取管理员列表   |
|          | /admininfo/:id      | GET    | 获取单个管理员   |
|          | /admininfo          | POST   | 创建管理员       |
|          | /admininfo/:id      | PUT    | 更新管理员       |
|          | /admininfo/:id      | DELETE | 删除管理员       |

---

## 十、关键改进

### 1. 数据持久化

从 json-server 迁移到 MySQL，提高数据安全性和并发处理能力

### 2. API 统一

所有 HTTP 请求通过统一的 axios 实例，便于统一处理认证、拦截等

### 3. 代码规范

遵循 RESTful API 规范，清晰的接口设计便于维护和扩展

### 4. 错误处理

统一的响应拦截器处理 API 错误，改善用户体验

### 5. 代码复用

通过 API 封装，避免重复的 axios 调用代码

---

**迁移完成时间**：2025 年 12 月 16 日  
**迁移状态**：✅ 完成
