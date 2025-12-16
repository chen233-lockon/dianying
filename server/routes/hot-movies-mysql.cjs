const express = require("express");
const router = express.Router();
const { pool } = require("../db-mysql.cjs");

// 获取热门电影列表
router.get("/", async (req, res) => {
  try {
    const [hotMovies] = await pool.query(
      "SELECT * FROM hot_movies ORDER BY id ASC"
    );
    res.json(hotMovies);
  } catch (error) {
    console.error("获取热门电影列表失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 创建热门电影
router.post("/", async (req, res) => {
  try {
    const { title, poster, highlights } = req.body;
    const [result] = await pool.query(
      "INSERT INTO hot_movies (title, poster, highlights) VALUES (?, ?, ?)",
      [title, poster, highlights]
    );
    res.status(201).json({ id: result.insertId, title, poster, highlights });
  } catch (error) {
    console.error("创建热门电影失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 更新热门电影
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, poster, highlights } = req.body;
    await pool.query(
      "UPDATE hot_movies SET title = ?, poster = ?, highlights = ? WHERE id = ?",
      [title, poster, highlights, id]
    );
    res.json({ id: parseInt(id), title, poster, highlights });
  } catch (error) {
    console.error("更新热门电影失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 删除热门电影
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM hot_movies WHERE id = ?", [id]);
    res.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除热门电影失败:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
