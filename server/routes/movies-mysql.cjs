const express = require("express");
const router = express.Router();
const { pool } = require("../db-mysql.cjs");

// 获取电影列表
router.get("/", async (req, res) => {
  try {
    const [movies] = await pool.query("SELECT * FROM movies ORDER BY id ASC");

    // 解析 JSON 字段（处理可能的解析错误）
    const formattedMovies = movies.map((movie) => {
      let actors = [];
      let genre = [];
      let category_id = [];

      try {
        actors =
          typeof movie.actors === "string"
            ? JSON.parse(movie.actors)
            : movie.actors || [];
      } catch (e) {
        actors = [];
      }

      try {
        genre =
          typeof movie.genre === "string"
            ? JSON.parse(movie.genre)
            : movie.genre || [];
      } catch (e) {
        genre = [];
      }

      try {
        // 将category_id解析为数组
        if (typeof movie.category_id === "string") {
          // 尝试作为 JSON 解析
          try {
            category_id = JSON.parse(movie.category_id);
          } catch {
            // 如果不是 JSON 格式，可能是普通字符串数字，转换为数字
            const numId = parseInt(movie.category_id);
            category_id = isNaN(numId) ? [] : [numId];
          }
        } else {
          category_id = movie.category_id || [];
        }

        // 如果是单个数字，转换为数组
        if (typeof category_id === "number") {
          category_id = [category_id];
        }

        // 确保是数组
        if (!Array.isArray(category_id)) {
          category_id = [];
        }
      } catch (e) {
        category_id = [];
      }

      return {
        ...movie,
        actors,
        genre,
        category_id,
      };
    });

    res.json(formattedMovies);
  } catch (error) {
    console.error("获取电影列表失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 创建电影
router.post("/", async (req, res) => {
  try {
    const {
      name,
      score,
      image,
      description,
      director,
      actors,
      releaseDate,
      genre,
      explain,
      duration,
      category_id,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO movies (name, score, image, description, director, actors, releaseDate, genre, \`explain\`, duration, category_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        score,
        image,
        description,
        director,
        JSON.stringify(actors || []),
        releaseDate,
        JSON.stringify(genre || []),
        explain,
        duration,
        JSON.stringify(category_id || []),
      ]
    );

    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error("创建电影失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 获取单个电影详情
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("获取电影详情，ID:", id);
    const [movies] = await pool.query("SELECT * FROM movies WHERE id = ?", [
      id,
    ]);
    console.log("查询结果:", movies.length, "条记录");

    if (movies.length === 0) {
      console.log("电影未找到");
      return res.status(404).json({ error: "Movie not found" });
    }

    const movie = movies[0];

    // 解析 JSON 字段
    let actors = [];
    let genre = [];
    let category_id = [];

    try {
      actors =
        typeof movie.actors === "string"
          ? JSON.parse(movie.actors)
          : movie.actors || [];
    } catch (e) {
      actors = [];
    }

    try {
      genre =
        typeof movie.genre === "string"
          ? JSON.parse(movie.genre)
          : movie.genre || [];
    } catch (e) {
      genre = [];
    }

    try {
      if (typeof movie.category_id === "string") {
        try {
          category_id = JSON.parse(movie.category_id);
        } catch {
          const numId = parseInt(movie.category_id);
          category_id = isNaN(numId) ? [] : [numId];
        }
      } else {
        category_id = movie.category_id || [];
      }

      if (typeof category_id === "number") {
        category_id = [category_id];
      }

      if (!Array.isArray(category_id)) {
        category_id = [];
      }
    } catch (e) {
      category_id = [];
    }

    res.json({
      ...movie,
      actors,
      genre,
      category_id,
    });
  } catch (error) {
    console.error("获取电影详情失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 更新电影
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      score,
      image,
      description,
      director,
      actors,
      releaseDate,
      genre,
      explain,
      duration,
      category_id,
    } = req.body;

    await pool.query(
      `UPDATE movies 
       SET name=?, score=?, image=?, description=?, director=?, actors=?, releaseDate=?, genre=?, \`explain\`=?, duration=?, category_id=?
       WHERE id=?`,
      [
        name,
        score,
        image,
        description,
        director,
        JSON.stringify(actors || []),
        releaseDate,
        JSON.stringify(genre || []),
        explain,
        duration,
        JSON.stringify(category_id || []),
        id,
      ]
    );

    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    console.error("更新电影失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 删除电影
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM movies WHERE id = ?", [id]);
    res.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除电影失败:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
