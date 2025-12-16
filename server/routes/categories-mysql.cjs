const express = require("express");
const router = express.Router();
const { pool } = require("../db-mysql.cjs");

// 获取分类列表
router.get("/", async (req, res) => {
  try {
    const [categories] = await pool.query(
      "SELECT * FROM categories ORDER BY id ASC"
    );
    res.json(categories);
  } catch (error) {
    console.error("获取分类列表失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 创建分类
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const [result] = await pool.query(
      "INSERT INTO categories (name) VALUES (?)",
      [name]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    console.error("创建分类失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 更新分类
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await pool.query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
    res.json({ id: parseInt(id), name });
  } catch (error) {
    console.error("更新分类失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 删除分类
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    res.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除分类失败:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
