const express = require("express");
const router = express.Router();
const { pool } = require("../db-mysql.cjs");

// 获取帖子列表
router.get("/", async (req, res) => {
  try {
    const [posts] = await pool.query("SELECT * FROM posts ORDER BY id DESC");
    res.json(posts);
  } catch (error) {
    console.error("获取帖子列表失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 获取单个帖子
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [posts] = await pool.query("SELECT * FROM posts WHERE id = ?", [id]);
    if (posts.length === 0) {
      return res.status(404).json({ error: "帖子不存在" });
    }
    res.json(posts[0]);
  } catch (error) {
    console.error("获取帖子失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 创建帖子
router.post("/", async (req, res) => {
  try {
    const { content, author, time } = req.body;
    const [result] = await pool.query(
      "INSERT INTO posts (content, author, time) VALUES (?, ?, ?)",
      [content, author, time]
    );
    res.status(201).json({ id: result.insertId, content, author, time });
  } catch (error) {
    console.error("创建帖子失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 更新帖子
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content, author, time } = req.body;
    await pool.query(
      "UPDATE posts SET content = ?, author = ?, time = ? WHERE id = ?",
      [content, author, time, id]
    );
    res.json({ id: parseInt(id), content, author, time });
  } catch (error) {
    console.error("更新帖子失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 删除帖子
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM posts WHERE id = ?", [id]);
    res.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除帖子失败:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
