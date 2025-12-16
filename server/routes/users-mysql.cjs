const express = require("express");
const router = express.Router();
const { pool } = require("../db-mysql.cjs");

// 获取用户列表
router.get("/", async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * FROM users ORDER BY id ASC");

    // 解析 JSON 字段
    const formattedUsers = users.map((user) => {
      let hobbies = [];
      let collections = [];
      let comments = [];
      let favorites = [];

      try {
        hobbies =
          typeof user.hobbies === "string"
            ? JSON.parse(user.hobbies)
            : user.hobbies || [];
      } catch (e) {
        hobbies = [];
      }

      try {
        collections =
          typeof user.collections === "string"
            ? JSON.parse(user.collections)
            : user.collections || [];
      } catch (e) {
        collections = [];
      }

      try {
        comments =
          typeof user.comments === "string"
            ? JSON.parse(user.comments)
            : user.comments || [];
      } catch (e) {
        comments = [];
      }

      try {
        favorites =
          typeof user.favorites === "string"
            ? JSON.parse(user.favorites)
            : user.favorites || [];
      } catch (e) {
        favorites = [];
      }

      return {
        ...user,
        hobbies,
        collections,
        comments,
        favorites,
      };
    });

    res.json(formattedUsers);
  } catch (error) {
    console.error("获取用户列表失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// ===== 收藏相关路由（必须在 /:id 之前定义） =====

// 获取用户收藏列表（带完整电影信息）
router.get("/:id/favorites", async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query(
      "SELECT favorites FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "用户不存在" });
    }

    let favoriteIds = [];
    try {
      favoriteIds =
        typeof users[0].favorites === "string"
          ? JSON.parse(users[0].favorites)
          : users[0].favorites || [];
    } catch (e) {
      favoriteIds = [];
    }

    // 如果没有收藏，直接返回空数组
    if (favoriteIds.length === 0) {
      return res.json({ favorites: [], favoriteIds: [] });
    }

    // 根据电影ID查询完整的电影信息
    const placeholders = favoriteIds.map(() => "?").join(",");
    const [movies] = await pool.query(
      `SELECT * FROM movies WHERE id IN (${placeholders})`,
      favoriteIds
    );

    // 解析电影的JSON字段
    const formattedMovies = movies.map((movie) => {
      try {
        movie.actors =
          typeof movie.actors === "string"
            ? JSON.parse(movie.actors)
            : movie.actors || [];
        movie.genre =
          typeof movie.genre === "string"
            ? JSON.parse(movie.genre)
            : movie.genre || [];
        movie.category_id =
          typeof movie.category_id === "string"
            ? JSON.parse(movie.category_id)
            : movie.category_id;
      } catch (e) {
        console.error("解析电影数据失败:", e);
      }
      return movie;
    });

    res.json({
      favorites: formattedMovies, // 完整的电影对象数组
      favoriteIds: favoriteIds, // 电影ID数组
    });
  } catch (error) {
    console.error("获取收藏列表失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 添加收藏
router.post("/:id/favorites", async (req, res) => {
  try {
    const { id } = req.params;
    const { movieId } = req.body;

    // 获取用户当前的收藏列表
    const [users] = await pool.query(
      "SELECT favorites FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "用户不存在" });
    }

    let favorites = [];
    try {
      favorites =
        typeof users[0].favorites === "string"
          ? JSON.parse(users[0].favorites)
          : users[0].favorites || [];
    } catch (e) {
      favorites = [];
    }

    // 检查是否已经收藏
    if (!favorites.includes(movieId)) {
      favorites.push(movieId);

      // 更新数据库
      await pool.query("UPDATE users SET favorites = ? WHERE id = ?", [
        JSON.stringify(favorites),
        id,
      ]);
    }

    res.json({ favorites });
  } catch (error) {
    console.error("添加收藏失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 取消收藏
router.delete("/:id/favorites/:movieId", async (req, res) => {
  try {
    const { id, movieId } = req.params;

    // 获取用户当前的收藏列表
    const [users] = await pool.query(
      "SELECT favorites FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "用户不存在" });
    }

    let favorites = [];
    try {
      favorites =
        typeof users[0].favorites === "string"
          ? JSON.parse(users[0].favorites)
          : users[0].favorites || [];
    } catch (e) {
      favorites = [];
    }

    // 从收藏列表中移除
    favorites = favorites.filter((fid) => fid !== parseInt(movieId));

    // 更新数据库
    await pool.query("UPDATE users SET favorites = ? WHERE id = ?", [
      JSON.stringify(favorites),
      id,
    ]);

    res.json({ favorites });
  } catch (error) {
    console.error("取消收藏失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// ===== 基本用户路由 =====

// 获取单个用户
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

    if (users.length === 0) {
      return res.status(404).json({ error: "用户不存在" });
    }

    const user = users[0];
    // 解析 JSON 字段
    user.hobbies =
      typeof user.hobbies === "string"
        ? JSON.parse(user.hobbies)
        : user.hobbies || [];
    user.collections =
      typeof user.collections === "string"
        ? JSON.parse(user.collections)
        : user.collections || [];
    user.comments =
      typeof user.comments === "string"
        ? JSON.parse(user.comments)
        : user.comments || [];
    user.favorites =
      typeof user.favorites === "string"
        ? JSON.parse(user.favorites)
        : user.favorites || [];

    res.json(user);
  } catch (error) {
    console.error("获取用户失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 创建用户
router.post("/", async (req, res) => {
  try {
    const {
      account,
      password,
      avatar,
      nickname,
      gender,
      age,
      addtime,
      birthday,
      identity,
      hobbies,
      signature,
      collections,
      comments,
      favorites,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO users (account, password, avatar, nickname, gender, age, addtime, birthday, identity, hobbies, signature, collections, comments, favorites)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        account,
        password,
        avatar || "",
        nickname || "",
        gender || "male",
        age || 18,
        addtime || new Date().toISOString().split("T")[0],
        birthday || "2000-01-01",
        identity || "普通用户",
        JSON.stringify(hobbies || []),
        signature || "",
        JSON.stringify(collections || []),
        JSON.stringify(comments || []),
        JSON.stringify(favorites || []),
      ]
    );

    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error("创建用户失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 更新用户
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      account,
      password,
      avatar,
      nickname,
      gender,
      age,
      addtime,
      birthday,
      identity,
      hobbies,
      signature,
      collections,
      comments,
      favorites,
    } = req.body;

    await pool.query(
      `UPDATE users SET 
        account = ?, password = ?, avatar = ?, nickname = ?, gender = ?, 
        age = ?, addtime = ?, birthday = ?, identity = ?, hobbies = ?, 
        signature = ?, collections = ?, comments = ?, favorites = ?
       WHERE id = ?`,
      [
        account,
        password,
        avatar,
        nickname,
        gender,
        age,
        addtime,
        birthday,
        identity,
        JSON.stringify(hobbies || []),
        signature,
        JSON.stringify(collections || []),
        JSON.stringify(comments || []),
        JSON.stringify(favorites || []),
        id,
      ]
    );

    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    console.error("更新用户失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 删除用户
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除用户失败:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
