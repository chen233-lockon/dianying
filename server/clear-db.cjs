const { pool } = require("./db-mysql.cjs");

async function clearDatabase() {
  let connection;

  try {
    console.log("🔄 开始清空数据库...");

    connection = await pool.getConnection();

    // 获取所有表
    const [tables] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
      ["chen_db_2004"]
    );

    // 禁用外键约束
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");

    // 删除所有表
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
      console.log(`✅ 已删除表: ${tableName}`);
    }

    // 启用外键约束
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("🎉 数据库清空完成！");
  } catch (error) {
    console.error("❌ 清空失败:", error.message);
    throw error;
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

clearDatabase().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
