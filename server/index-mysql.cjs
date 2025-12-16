const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { testConnection } = require("./db-mysql.cjs");
const moviesRouter = require("./routes/movies-mysql.cjs");
const categoriesRouter = require("./routes/categories-mysql.cjs");
const carouselRouter = require("./routes/carousel-mysql.cjs");
const announcementsRouter = require("./routes/announcements-mysql.cjs");
const hotMoviesRouter = require("./routes/hot-movies-mysql.cjs");
const postsRouter = require("./routes/posts-mysql.cjs");
const usersRouter = require("./routes/users-mysql.cjs");
const rankingsRouter = require("./routes/rankings-mysql.cjs");
const admininfoRouter = require("./routes/admininfo-mysql.cjs");

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 日志中间件
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} [${req.method}] ${req.url}`);
  next();
});

// 路由
app.use("/movies", moviesRouter);
app.use("/categories", categoriesRouter);
app.use("/carouselImages", carouselRouter);
app.use("/announcements", announcementsRouter);
app.use("/hotMovies", hotMoviesRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/rankings", rankingsRouter);
app.use("/admininfo", admininfoRouter);

// 健康检查
app.get("/health", async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: dbConnected ? "ok" : "error",
    message: dbConnected ? "Express + MySQL 服务器运行正常" : "MySQL 连接失败",
    database: "kechengsql",
    timestamp: new Date().toISOString(),
  });
});

// 根路径
app.get("/", (req, res) => {
  res.json({
    message: "欢迎使用电影管理系统后端API (MySQL)",
    database: "kechengsql",
    endpoints: {
      movies: "/movies",
      categories: "/categories",
      carouselImages: "/carouselImages",
      announcements: "/announcements",
      hotMovies: "/hotMovies",
      rankings: "/rankings",
      admininfo: "/admininfo",
      posts: "/posts",
      users: "/users",
      health: "/health",
    },
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", path: req.url });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error("❌ 服务器错误:", err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

// 启动服务器
async function startServer() {
  // 测试数据库连接
  const connected = await testConnection();
  if (!connected) {
    console.error("⚠️  警告: MySQL 连接失败，请检查配置");
  }

  app.listen(PORT, () => {
    console.log("=".repeat(60));
    console.log(`✅ Express + MySQL 服务器运行在 http://localhost:${PORT}`);
    console.log(`🗄️  数据库: chen_db_2004 @ mysql.sqlpub.com`);
    console.log(`📊 健康检查: http://localhost:${PORT}/health`);
    console.log(`🎬 电影接口: http://localhost:${PORT}/movies`);
    console.log(`📁 分类接口: http://localhost:${PORT}/categories`);
    console.log("=".repeat(60));
  });
}

startServer();
