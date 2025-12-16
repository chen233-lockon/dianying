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

      return {
        ...movie,
        actors,
        genre,
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
        category_id,
      ]
    );

    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error("创建电影失败:", error);
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
        category_id,
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
