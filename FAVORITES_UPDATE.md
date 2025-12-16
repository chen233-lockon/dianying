# 收藏功能更新说明

## 更新内容

### 1. 数据库更新

- ✅ 在 `users` 表中添加了 `favorites` 字段（JSON 类型）
- ✅ 该字段存储用户收藏的电影 ID 数组，例如：`[1, 5, 10, 23]`

### 2. 后端 API 更新

#### 新增的 API 端点：

**添加收藏**

```
POST /users/:id/favorites
Body: { movieId: 数字 }
Response: { favorites: [1, 2, 3] }
```

**取消收藏**

```
DELETE /users/:id/favorites/:movieId
Response: { favorites: [1, 2, 3] }
```

**获取用户收藏列表**

```
GET /users/:id/favorites
Response: { favorites: [1, 2, 3] }
```

### 3. 前端更新

#### API 调用 (`src/api/index.js`)

新增了三个方法：

- `userAPI.addFavorite(userId, movieId)` - 添加收藏
- `userAPI.removeFavorite(userId, movieId)` - 取消收藏
- `userAPI.getFavorites(userId)` - 获取收藏列表

#### Store 更新 (`src/stores/favorites.js`)

- 改用新的 API 端点
- `favorites` 现在存储电影 ID 数组而不是完整的电影对象
- 自动与后端同步

## 工作流程

### 用户点击收藏按钮时：

1. **前端**：用户点击"收藏"按钮
2. **验证**：检查用户是否登录
3. **调用 API**：`userAPI.addFavorite(userId, movieId)`
4. **后端处理**：
   - 从数据库读取用户的 `favorites` 数组
   - 检查电影 ID 是否已存在
   - 如果不存在，添加到数组中
   - 更新数据库
5. **返回结果**：返回更新后的 `favorites` 数组
6. **更新本地**：前端更新 store 中的 `favorites`

### 用户点击取消收藏时：

1. **前端**：用户点击"已收藏"按钮
2. **调用 API**：`userAPI.removeFavorite(userId, movieId)`
3. **后端处理**：
   - 从数据库读取用户的 `favorites` 数组
   - 从数组中移除该电影 ID
   - 更新数据库
4. **返回结果**：返回更新后的 `favorites` 数组
5. **更新本地**：前端更新 store 中的 `favorites`

## 数据存储对比

### 旧方案（collections 字段）：

```json
{
  "collections": [
    {
      "id": 1,
      "name": "电影名称",
      "image": "图片地址",
      "score": 8.5,
      ...其他完整的电影信息
    }
  ]
}
```

### 新方案（favorites 字段）：

```json
{
  "favorites": [1, 5, 10, 23]
}
```

## 优势

1. **数据冗余减少**：只存储电影 ID，不存储完整的电影对象
2. **数据一致性**：电影信息更新时，收藏列表自动同步
3. **性能提升**：数据量更小，传输更快
4. **结构清晰**：职责分明，用户表只存 ID，电影详情从 movies 表获取

## 使用示例

```javascript
// 添加收藏
await favoritesStore.addFavorite(movie);

// 取消收藏
await favoritesStore.removeFavorite(movieId);

// 检查是否已收藏
const isFav = favoritesStore.isFavorite(movieId);

// 获取收藏列表
await favoritesStore.fetchFavorites();
```

## 注意事项

- ✅ 数据库已更新，添加了 `favorites` 字段
- ✅ 后端 API 已部署
- ✅ 前端代码已更新
- 需要重启服务器以加载新的 API 路由
- 用户需要重新登录以确保数据同步

## 测试步骤

1. 启动服务器：`npm run server`
2. 访问电影库页面
3. 登录账号
4. 点击"收藏"按钮
5. 检查浏览器控制台，确认 API 调用成功
6. 刷新页面，确认收藏状态保持
