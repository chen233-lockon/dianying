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

      return {
        ...user,
        hobbies,
        collections,
        comments,
      };
    });

    res.json(formattedUsers);
  } catch (error) {
    console.error("获取用户列表失败:", error);
    res.status(500).json({ error: error.message });
  }
});

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
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO users (account, password, avatar, nickname, gender, age, addtime, birthday, identity, hobbies, signature, collections, comments)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    } = req.body;

    await pool.query(
      `UPDATE users SET 
        account = ?, password = ?, avatar = ?, nickname = ?, gender = ?, 
        age = ?, addtime = ?, birthday = ?, identity = ?, hobbies = ?, 
        signature = ?, collections = ?, comments = ?
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
