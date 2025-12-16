const { pool } = require("./db-mysql.cjs");

async function addFavoritesColumn() {
  let connection;

  try {
    console.log("🔄 正在添加 favorites 字段到 users 表...");

    connection = await pool.getConnection();

    // 检查 favorites 列是否已存在
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'favorites'
    `);

    if (columns.length > 0) {
      console.log("✅ favorites 字段已存在");
      return;
    }

    // 添加 favorites 列
    await connection.query(`
      ALTER TABLE users 
      ADD COLUMN favorites JSON DEFAULT NULL
    `);

    // 为所有现有用户初始化 favorites 为空数组
    await connection.query(`
      UPDATE users 
      SET favorites = '[]' 
      WHERE favorites IS NULL
    `);

    console.log("✅ favorites 字段添加成功");
    console.log("✅ 所有用户的 favorites 已初始化为空数组");
  } catch (error) {
    console.error("❌ 添加 favorites 字段失败:", error.message);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
    await pool.end();
  }
}

// 执行
addFavoritesColumn()
  .then(() => {
    console.log("✅ 完成！");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
