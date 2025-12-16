const mysql = require("mysql2/promise");

// MySQL 连接池配置
const pool = mysql.createPool({
  host: "mysql.sqlpub.com",
  port: 3306,
  user: "sympathy",
  password: "oa1JCczD3jLLlE7M",
  database: "chen_db_2004",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

// 测试连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL 数据库连接成功");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ MySQL 连接失败:", error.message);
    return false;
  }
}

module.exports = { pool, testConnection };
