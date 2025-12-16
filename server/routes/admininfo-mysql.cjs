const express = require("express");
const router = express.Router();
const { pool } = require("../db-mysql.cjs");

// 获取管理员列表
router.get("/", async (req, res) => {
  try {
    const [admininfo] = await pool.query(
      "SELECT * FROM admininfo ORDER BY id ASC"
    );
    res.json(admininfo);
  } catch (error) {
    console.error("获取管理员列表失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 获取单个管理员
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [admininfo] = await pool.query(
      "SELECT * FROM admininfo WHERE id = ?",
      [id]
    );

    if (admininfo.length === 0) {
      return res.status(404).json({ error: "管理员不存在" });
    }

    res.json(admininfo[0]);
  } catch (error) {
    console.error("获取管理员失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 创建管理员
router.post("/", async (req, res) => {
  try {
    const { username, password, avatar, email, phone, registerDate } = req.body;

    const [result] = await pool.query(
      `INSERT INTO admininfo (username, password, avatar, email, phone, registerDate)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        username,
        password,
        avatar || "",
        email || "",
        phone || "",
        registerDate || "",
      ]
    );

    res.status(201).json({
      id: result.insertId,
      username,
      password,
      avatar,
      email,
      phone,
      registerDate,
    });
  } catch (error) {
    console.error("创建管理员失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 更新管理员
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, avatar, email, phone, registerDate } = req.body;

    await pool.query(
      `UPDATE admininfo SET username = ?, password = ?, avatar = ?, email = ?, phone = ?, registerDate = ? WHERE id = ?`,
      [username, password, avatar, email, phone, registerDate, id]
    );

    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    console.error("更新管理员失败:", error);
    res.status(500).json({ error: error.message });
  }
});

// 删除管理员
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM admininfo WHERE id = ?", [id]);
    res.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除管理员失败:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
