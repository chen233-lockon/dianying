# 项目快速启动指南

## 📋 项目概述

电影管理系统 - 前后端分离架构

- **后端**：Express.js + MySQL
- **前端**：Vue 3 + Pinia + Element Plus
- **API 风格**：RESTful
- **数据库迁移**：从 json-server 完全迁移到 MySQL

---

## ✅ 迁移完成状态

### 数据迁移

- ✅ categories（分类）
- ✅ movies（电影）
- ✅ carousel_images（轮播图）
- ✅ announcements（公告）
- ✅ hot_movies（热门电影）
- ✅ posts（帖子）
- ✅ users（用户）
- ✅ rankings（排行榜）
- ✅ admininfo（管理员）

### 接口统一

- ✅ 后端：7 个新 API 路由 + 2 个现有路由 = 9 个 RESTful API
- ✅ 前端：统一 axios 封装（src/api/index.js）
- ✅ 组件：13 个文件更新为使用统一 API

---

## 🚀 快速开始

### 1. 后端启动

#### 前提条件

- Node.js >= 14
- MySQL 5.7+ 或 8.0+
- 数据库连接配置已准备好（server/db-mysql.cjs）

#### 初始化数据库

```bash
cd server
node init-mysql.cjs
```

预期输出：

```
🔄 开始初始化 MySQL 数据库...
✅ 表结构创建完成
📥 开始导入数据...
✅ 电影数据导入完成: XX 条
✅ 分类数据导入完成: XX 条
✅ 轮播图数据导入完成: XX 条
✅ 公告数据导入完成: XX 条
✅ 热门电影数据导入完成: XX 条
✅ 帖子数据导入完成: XX 条
✅ 用户数据导入完成: XX 条
✅ 排行榜数据导入完成: XX 条
✅ 管理员信息导入完成: XX 条
🎉 MySQL 数据库初始化完成！
```

#### 启动后端服务

```bash
node index-mysql.cjs
```

预期输出：

```
============================================================
✅ Express + MySQL 服务器运行在 http://localhost:3000
🗄️  数据库: kechengsql
📊 健康检查: http://localhost:3000/health
🎬 电影接口: http://localhost:3000/movies
📁 分类接口: http://localhost:3000/categories
...
============================================================
```

### 2. 前端启动

#### 前提条件

- Node.js >= 14
- npm 或 yarn

#### 安装依赖

```bash
npm install
```

#### 启动开发服务器

```bash
npm run dev
```

#### 构建生产版本

```bash
npm run build
```

---

## 📡 API 测试

### 方法 1：使用浏览器

访问以下 URL 测试：

- 电影列表：http://localhost:3000/movies
- 分类列表：http://localhost:3000/categories
- 用户列表：http://localhost:3000/users
- 健康检查：http://localhost:3000/health

### 方法 2：使用 Postman

1. 新建 Postman 集合
2. 导入示例请求：

```json
{
  "name": "电影管理系统API",
  "requests": [
    {
      "name": "获取电影列表",
      "method": "GET",
      "url": "http://localhost:3000/movies"
    },
    {
      "name": "创建电影",
      "method": "POST",
      "url": "http://localhost:3000/movies",
      "body": {
        "name": "新电影",
        "score": 8.5,
        "image": "http://...",
        "description": "描述",
        "director": "导演",
        "actors": ["演员1"],
        "releaseDate": "2025-01-01",
        "genre": ["动作"],
        "explain": "详细说明",
        "duration": 120,
        "category_id": "1"
      }
    }
  ]
}
```

### 方法 3：使用 cURL

```bash
# 获取电影列表
curl http://localhost:3000/movies

# 获取分类列表
curl http://localhost:3000/categories

# 创建电影
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "新电影",
    "score": 8.5,
    "image": "http://...",
    "description": "描述",
    "director": "导演",
    "actors": ["演员1"],
    "releaseDate": "2025-01-01",
    "genre": ["动作"],
    "explain": "详细说明",
    "duration": 120,
    "category_id": "1"
  }'

# 删除电影
curl -X DELETE http://localhost:3000/movies/1
```

---

## 📂 文件结构

### 后端新增/修改文件

```
server/
├── index-mysql.cjs              ✅ 主服务器文件（已更新）
├── init-mysql.cjs               ✅ 数据库初始化（已更新）
├── db-mysql.cjs                 ← 数据库配置
└── routes/
    ├── movies-mysql.cjs         ✅ 电影路由
    ├── categories-mysql.cjs      ✅ 分类路由
    ├── carousel-mysql.cjs        ✨ 新增轮播图路由
    ├── announcements-mysql.cjs   ✨ 新增公告路由
    ├── hot-movies-mysql.cjs      ✨ 新增热门电影路由
    ├── posts-mysql.cjs           ✨ 新增帖子路由
    ├── users-mysql.cjs           ✨ 新增用户路由
    ├── rankings-mysql.cjs        ✨ 新增排行榜路由
    └── admininfo-mysql.cjs       ✨ 新增管理员路由
```

### 前端新增/修改文件

```
src/
├── api/
│   └── index.js                 ✅ API统一封装（已完全重写）
├── stores/
│   ├── auth.js                  ✅ 认证store（已更新）
│   ├── users.js                 ✅ 用户store（已更新）
│   └── user.js                  ✅ 用户信息store（已更新）
└── components/
    ├── subcomponents/
    │   ├── HomePage.vue         ✅ 首页（已更新）
    │   ├── Communication.vue     ✅ 论坛（已更新）
    │   ├── UserCenter.vue        ✅ 用户中心（已更新）
    │   ├── Movies.vue            ✅ 排行榜（已更新）
    │   ├── register.vue          ✅ 注册（已更新）
    │   ├── qianlogin.vue         ✅ 登录（已更新）
    │   └── Layout/
    │       └── MyHeader.vue      ✅ 头部（已更新）
    ├── user/
    │   └── MyUserDetail.vue      ✅ 用户详情（已更新）
    └── backend/
        └── Login.vue             ✅ 后台登录（已更新）
```

---

## 🔧 环境配置

### 后端数据库配置

编辑 `server/db-mysql.cjs`：

```javascript
const pool = mysql.createPool({
  host: "your-host",
  user: "your-username",
  password: "your-password",
  database: "your-database",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

### 前端 API 配置

编辑 `src/api/index.js`：

```javascript
const instance = axios.create({
  baseURL: "http://localhost:3000", // 修改为实际后端地址
  timeout: 10000,
});
```

---

## 📝 常见问题

### Q: 如何修改数据库连接？

A: 编辑 `server/db-mysql.cjs` 中的数据库配置信息。

### Q: 如何重新初始化数据库？

A:

```bash
# 1. 删除现有数据库中的表
# 2. 运行初始化脚本
node server/init-mysql.cjs
```

### Q: 如何查看 API 文档？

A: 查看 `API_DOCUMENTATION.md` 文件。

### Q: 前端如何使用 API？

A: 查看 `FRONTEND_API_GUIDE.md` 文件。

### Q: 迁移了哪些数据？

A: 查看 `API_MIGRATION_SUMMARY.md` 文件。

### Q: 后端服务无法启动？

A:

1. 检查 MySQL 是否运行
2. 检查数据库连接配置是否正确
3. 查看终端错误信息

### Q: 前端无法连接后端？

A:

1. 确认后端服务已启动
2. 检查 `src/api/index.js` 中的 baseURL 是否正确
3. 检查浏览器控制台是否有 CORS 错误

---

## 📚 相关文档

项目根目录下的文档文件：

| 文件名                   | 说明                   |
| ------------------------ | ---------------------- |
| API_MIGRATION_SUMMARY.md | 数据迁移和接口统一总结 |
| API_DOCUMENTATION.md     | 后端 API 接口完整文档  |
| FRONTEND_API_GUIDE.md    | 前端 API 使用指南      |
| README.md                | 项目原始说明文档       |

---

## 🎯 关键改进点

### 1. 数据安全性

- ❌ 之前：使用 json-server（仅开发用）
- ✅ 现在：使用 MySQL 数据库（生产级）

### 2. 接口统一

- ❌ 之前：各组件直接调用 axios
- ✅ 现在：统一 API 封装，易于维护和扩展

### 3. 代码规范

- ❌ 之前：接口调用分散在各组件
- ✅ 现在：集中管理，便于统一修改

### 4. 错误处理

- ❌ 之前：各组件自己处理错误
- ✅ 现在：拦截器统一处理，减少重复代码

### 5. 性能优化

- ❌ 之前：无缓存机制
- ✅ 现在：支持添加请求缓存和并发控制

---

## ⚠️ 注意事项

1. **数据库备份**：生产环境前务必备份数据库
2. **密码安全**：修改 admin 账户默认密码（123456）
3. **CORS 配置**：根据实际环境修改 CORS 白名单
4. **超时设置**：根据网络情况调整 axios 超时时间
5. **错误日志**：定期检查服务器错误日志

---

## 📞 技术支持

- 后端问题：查看 `API_DOCUMENTATION.md`
- 前端问题：查看 `FRONTEND_API_GUIDE.md`
- 数据迁移：查看 `API_MIGRATION_SUMMARY.md`

---

**项目版本**：2.0（已迁移至 MySQL）  
**更新日期**：2025 年 12 月 16 日  
**状态**：✅ 完成
