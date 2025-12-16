const express = require("express");
const router = express.Router();
const { pool } = require("../db-mysql.cjs");

// 获取排行榜列表
router.get("/", async (req, res) => {
  try {
    const [rankings] = await pool.query(
      "SELECT * FROM rankings ORDER BY id ASC"
    );

    // 解析 JSON 字段
    const formattedRankings = rankings.map((ranking) => {
      let actors = [];
      let comments = [];

      try {
        actors =
          typeof ranking.actors === "string"
            ? JSON.parse(ranking.actors)
            : ranking.actors || [];
      } catch (e) {
        actors = [];
      }

      try {
        comments =
          typeof ranking.comments === "string"
            ? JSON.parse(ranking.comments)
            : ranking.comments || [];
      } catch (e) {
        comments = [];
      }

      return {
        ...ranking,
        actors,
        comments,
      };
    });

    res.json(formattedRankings);
  } catch (error) {
    console.error("获取排行榜列表失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 获取单个排行榜项目
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rankings] = await pool.query("SELECT * FROM rankings WHERE id = ?", [
      id,
    ]);

    if (rankings.length === 0) {
      return res.status(404).json({ error: "排行榜项目不存在" });
    }

    const ranking = rankings[0];
    // 解析 JSON 字段
    ranking.actors =
      typeof ranking.actors === "string"
        ? JSON.parse(ranking.actors)
        : ranking.actors || [];
    ranking.comments =
      typeof ranking.comments === "string"
        ? JSON.parse(ranking.comments)
        : ranking.comments || [];

    res.json(ranking);
  } catch (error) {
    console.error("获取排行榜项目失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 创建排行榜项目
router.post("/", async (req, res) => {
  try {
    const { title, src, actors, description, recommendationIndex, comments } =
      req.body;

    const [result] = await pool.query(
      `INSERT INTO rankings (title, src, actors, description, recommendationIndex, comments)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        src,
        JSON.stringify(actors || []),
        description,
        recommendationIndex,
        JSON.stringify(comments || []),
      ]
    );

    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error("创建排行榜项目失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 更新排行榜项目
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, src, actors, description, recommendationIndex, comments } =
      req.body;

    await pool.query(
      `UPDATE rankings SET title = ?, src = ?, actors = ?, description = ?, recommendationIndex = ?, comments = ? WHERE id = ?`,
      [
        title,
        src,
        JSON.stringify(actors || []),
        description,
        recommendationIndex,
        JSON.stringify(comments || []),
        id,
      ]
    );

    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    console.error("更新排行榜项目失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 删除排行榜项目
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM rankings WHERE id = ?", [id]);
    res.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除排行榜项目失败:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
