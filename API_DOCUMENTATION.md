# 后端 API 接口文档

## 项目信息

- **框架**：Express.js
- **数据库**：MySQL
- **API 风格**：RESTful
- **基础 URL**：http://localhost:3000
- **端口**：3000

---

## 通用响应格式

### 成功响应 (200 OK)

```json
{
  "id": 1,
  "name": "资源名称",
  "createdAt": "2025-12-16T10:30:00Z"
}
```

### 创建成功响应 (201 Created)

```json
{
  "id": 1,
  "name": "资源名称"
}
```

### 删除成功响应 (200 OK)

```json
{
  "message": "删除成功"
}
```

### 错误响应 (4xx/5xx)

```json
{
  "error": "错误信息描述"
}
```

---

## 电影 (Movies)

### 获取电影列表

```
GET /movies
```

**响应示例**：

```json
[
  {
    "id": 1,
    "name": "电影名称",
    "score": 8.5,
    "image": "http://...",
    "description": "描述",
    "director": "导演",
    "actors": ["演员1", "演员2"],
    "releaseDate": "2025-01-01",
    "genre": ["动作", "科幻"],
    "explain": "详细说明",
    "duration": 120,
    "category_id": "1"
  }
]
```

### 获取单个电影

```
GET /movies/:id
```

### 创建电影

```
POST /movies
```

**请求体**：

```json
{
  "name": "电影名称",
  "score": 8.5,
  "image": "http://...",
  "description": "描述",
  "director": "导演",
  "actors": ["演员1", "演员2"],
  "releaseDate": "2025-01-01",
  "genre": ["动作", "科幻"],
  "explain": "详细说明",
  "duration": 120,
  "category_id": "1"
}
```

### 更新电影

```
PUT /movies/:id
```

### 删除电影

```
DELETE /movies/:id
```

---

## 分类 (Categories)

### 获取分类列表

```
GET /categories
```

**响应示例**：

```json
[
  {
    "id": 1,
    "name": "动作"
  },
  {
    "id": 2,
    "name": "科幻"
  }
]
```

### 获取单个分类

```
GET /categories/:id
```

### 创建分类

```
POST /categories
```

**请求体**：

```json
{
  "name": "分类名称"
}
```

### 更新分类

```
PUT /categories/:id
```

**请求体**：

```json
{
  "name": "新分类名称"
}
```

### 删除分类

```
DELETE /categories/:id
```

---

## 轮播图 (Carousel Images)

### 获取轮播图列表

```
GET /carouselImages
```

**响应示例**：

```json
[
  {
    "id": 1,
    "imageUrl": "http://...",
    "created_at": "2025-12-16T10:30:00Z"
  }
]
```

### 获取单个轮播图

```
GET /carouselImages/:id
```

### 创建轮播图

```
POST /carouselImages
```

**请求体**：

```json
{
  "imageUrl": "http://..."
}
```

### 更新轮播图

```
PUT /carouselImages/:id
```

**请求体**：

```json
{
  "imageUrl": "http://..."
}
```

### 删除轮播图

```
DELETE /carouselImages/:id
```

---

## 公告 (Announcements)

### 获取公告列表

```
GET /announcements
```

**响应示例**：

```json
[
  {
    "id": 1,
    "content": "公告内容",
    "created_at": "2025-12-16T10:30:00Z"
  }
]
```

### 创建公告

```
POST /announcements
```

**请求体**：

```json
{
  "content": "公告内容"
}
```

### 更新公告

```
PUT /announcements/:id
```

### 删除公告

```
DELETE /announcements/:id
```

---

## 热门电影 (Hot Movies)

### 获取热门电影列表

```
GET /hotMovies
```

**响应示例**：

```json
[
  {
    "id": 1,
    "title": "电影标题",
    "poster": "http://...",
    "highlights": "亮点描述"
  }
]
```

### 创建热门电影

```
POST /hotMovies
```

**请求体**：

```json
{
  "title": "电影标题",
  "poster": "http://...",
  "highlights": "亮点描述"
}
```

### 更新热门电影

```
PUT /hotMovies/:id
```

### 删除热门电影

```
DELETE /hotMovies/:id
```

---

## 帖子 (Posts)

### 获取帖子列表

```
GET /posts
```

**响应示例**：

```json
[
  {
    "id": 1,
    "content": "<p>帖子内容</p>",
    "author": "作者名",
    "time": "2025-12-16 10:30:00"
  }
]
```

### 获取单个帖子

```
GET /posts/:id
```

### 创建帖子

```
POST /posts
```

**请求体**：

```json
{
  "content": "<p>帖子内容</p>",
  "author": "作者名",
  "time": "2025-12-16 10:30:00"
}
```

### 更新帖子

```
PUT /posts/:id
```

### 删除帖子

```
DELETE /posts/:id
```

---

## 用户 (Users)

### 获取用户列表

```
GET /users
```

**响应示例**：

```json
[
  {
    "id": 1,
    "account": "zhangsan",
    "password": "123456",
    "avatar": "http://...",
    "nickname": "张三",
    "gender": "male",
    "age": 25,
    "addtime": "1998-05-15",
    "birthday": "1998-05-15",
    "identity": "学生",
    "hobbies": ["电影", "音乐"],
    "signature": "个人签名",
    "collections": [],
    "comments": []
  }
]
```

### 获取单个用户

```
GET /users/:id
```

### 创建用户

```
POST /users
```

**请求体**：

```json
{
  "account": "zhangsan",
  "password": "123456",
  "avatar": "http://...",
  "nickname": "张三",
  "gender": "male",
  "age": 25,
  "addtime": "1998-05-15",
  "birthday": "1998-05-15",
  "identity": "学生",
  "hobbies": ["电影", "音乐"],
  "signature": "个人签名",
  "collections": [],
  "comments": []
}
```

### 更新用户

```
PUT /users/:id
```

### 删除用户

```
DELETE /users/:id
```

---

## 排行榜 (Rankings)

### 获取排行榜列表

```
GET /rankings
```

**响应示例**：

```json
[
  {
    "id": 1,
    "title": "肖申克的救赎",
    "src": "http://...",
    "actors": ["演员1", "演员2"],
    "description": "电影描述",
    "recommendationIndex": 9.7,
    "comments": [
      {
        "text": "评论内容",
        "rating": 10
      }
    ]
  }
]
```

### 创建排行项

```
POST /rankings
```

**请求体**：

```json
{
  "title": "电影标题",
  "src": "http://...",
  "actors": ["演员1", "演员2"],
  "description": "描述",
  "recommendationIndex": 9.7,
  "comments": []
}
```

### 更新排行项

```
PUT /rankings/:id
```

### 删除排行项

```
DELETE /rankings/:id
```

---

## 管理员 (Admin Info)

### 获取管理员列表

```
GET /admininfo
```

**响应示例**：

```json
[
  {
    "id": 1,
    "username": "admin",
    "password": "123456",
    "avatar": "http://...",
    "email": "admin@example.com",
    "phone": "15520270102",
    "registerDate": "2023-01-15"
  }
]
```

### 获取单个管理员

```
GET /admininfo/:id
```

### 创建管理员

```
POST /admininfo
```

**请求体**：

```json
{
  "username": "admin",
  "password": "123456",
  "avatar": "http://...",
  "email": "admin@example.com",
  "phone": "15520270102",
  "registerDate": "2023-01-15"
}
```

### 更新管理员

```
PUT /admininfo/:id
```

### 删除管理员

```
DELETE /admininfo/:id
```

---

## 系统接口

### 健康检查

```
GET /health
```

**响应示例**：

```json
{
  "status": "ok",
  "message": "Express + MySQL 服务器运行正常",
  "database": "kechengsql",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

### 根路径

```
GET /
```

**响应示例**：

```json
{
  "message": "欢迎使用电影管理系统后端API (MySQL)",
  "database": "kechengsql",
  "endpoints": {
    "movies": "/movies",
    "categories": "/categories",
    "carouselImages": "/carouselImages",
    "announcements": "/announcements",
    "hotMovies": "/hotMovies",
    "posts": "/posts",
    "users": "/users",
    "rankings": "/rankings",
    "admininfo": "/admininfo",
    "health": "/health"
  }
}
```

---

## 错误处理

### 常见 HTTP 状态码

| 状态码 | 说明           |
| ------ | -------------- |
| 200    | 请求成功       |
| 201    | 资源创建成功   |
| 400    | 请求参数错误   |
| 404    | 资源不存在     |
| 500    | 服务器内部错误 |

### 错误响应示例

```json
{
  "error": "获取分类列表失败: 数据库连接错误"
}
```

---

## 数据类型说明

### JSON 字段支持

以下字段使用 MySQL 的 JSON 类型存储：

- `movies.actors` - 演员数组
- `movies.genre` - 类型数组
- `users.hobbies` - 爱好数组
- `users.collections` - 收藏数组
- `users.comments` - 评论数组
- `rankings.actors` - 演员数组
- `rankings.comments` - 评论数组

### 时间戳

所有表都包含 `created_at` 字段，自动记录创建时间，格式为 ISO 8601。

---

## 服务启动

### 初始化数据库

```bash
node server/init-mysql.cjs
```

此命令将：

1. 创建所有必需的表
2. 从 `src/json-serveer/db.json` 导入数据

### 启动服务器

```bash
node server/index-mysql.cjs
```

服务器将在 `http://localhost:3000` 上运行。

---

## 中间件和特性

### 已启用的中间件

- **CORS** - 允许跨域请求
- **Body Parser** - 解析 JSON 和表单数据
- **请求日志** - 自动记录所有请求

### 自动功能

- 时间戳记录（created_at）
- JSON 字段自动序列化/反序列化
- 错误统一处理和返回

---

**文档版本**：1.0  
**最后更新**：2025 年 12 月 16 日
