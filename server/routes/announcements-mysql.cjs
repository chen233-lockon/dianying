const express = require("express");
const router = express.Router();
const { pool } = require("../db-mysql.cjs");

// 获取公告列表
router.get("/", async (req, res) => {
  try {
    const [announcements] = await pool.query(
      "SELECT * FROM announcements ORDER BY id ASC"
    );
    res.json(announcements);
  } catch (error) {
    console.error("获取公告列表失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 创建公告
router.post("/", async (req, res) => {
  try {
    const { content } = req.body;
    const [result] = await pool.query(
      "INSERT INTO announcements (content) VALUES (?)",
      [content]
    );
    res.status(201).json({ id: result.insertId, content });
  } catch (error) {
    console.error("创建公告失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 更新公告
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    await pool.query("UPDATE announcements SET content = ? WHERE id = ?", [
      content,
      id,
    ]);
    res.json({ id: parseInt(id), content });
  } catch (error) {
    console.error("更新公告失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 删除公告
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM announcements WHERE id = ?", [id]);
    res.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除公告失败:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
