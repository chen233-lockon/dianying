const express = require("express");
const router = express.Router();
const { pool } = require("../db-mysql.cjs");

// 获取轮播图列表
router.get("/", async (req, res) => {
  try {
    const [carouselImages] = await pool.query(
      "SELECT * FROM carousel_images ORDER BY id ASC"
    );
    res.json(carouselImages);
  } catch (error) {
    console.error("获取轮播图列表失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 创建轮播图
router.post("/", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const [result] = await pool.query(
      "INSERT INTO carousel_images (imageUrl) VALUES (?)",
      [imageUrl]
    );
    res.status(201).json({ id: result.insertId, imageUrl });
  } catch (error) {
    console.error("创建轮播图失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 更新轮播图
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    await pool.query("UPDATE carousel_images SET imageUrl = ? WHERE id = ?", [
      imageUrl,
      id,
    ]);
    res.json({ id: parseInt(id), imageUrl });
  } catch (error) {
    console.error("更新轮播图失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 删除轮播图
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM carousel_images WHERE id = ?", [id]);
    res.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除轮播图失败:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
