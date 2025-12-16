const { pool } = require("./db-mysql.cjs");
const fs = require("fs");
const path = require("path");

async function initDatabase() {
  let connection;

  try {
    console.log("🔄 开始初始化 MySQL 数据库...");

    connection = await pool.getConnection();

    // 1. 创建电影表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        score DECIMAL(3,1),
        image TEXT,
        description TEXT,
        director VARCHAR(255),
        actors JSON,
        releaseDate VARCHAR(50),
        genre JSON,
        \`explain\` TEXT,
        duration INT,
        category_id VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 2. 创建分类表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 3. 创建轮播图表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS carousel_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        imageUrl TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 4. 创建公告表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 5. 创建热门电影表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hot_movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        poster TEXT,
        highlights TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 6. 创建帖子表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        author VARCHAR(100),
        time VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 7. 创建用户表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        avatar TEXT,
        nickname VARCHAR(100),
        gender VARCHAR(20),
        age INT,
        addtime VARCHAR(50),
        birthday VARCHAR(50),
        identity VARCHAR(50),
        hobbies JSON,
        signature TEXT,
        collections JSON,
        comments JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 8. 创建排行榜表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS rankings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        src TEXT,
        actors JSON,
        description TEXT,
        recommendationIndex DECIMAL(3,1),
        comments JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 9. 创建管理员信息表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admininfo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        avatar TEXT,
        email VARCHAR(100),
        phone VARCHAR(20),
        registerDate VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log("✅ 表结构创建完成");

    // 读取 db.json 数据
    const dbJsonPath = path.join(__dirname, "../src/json-serveer/db.json");
    const dbData = JSON.parse(fs.readFileSync(dbJsonPath, "utf-8"));

    // 检查是否已有数据
    const [existingMovies] = await connection.query(
      "SELECT COUNT(*) as count FROM movies"
    );
    if (existingMovies[0].count > 0) {
      console.log("⚠️  数据库已有数据，跳过导入。如需重新导入，请先清空表。");
      return;
    }

    // 导入电影数据
    if (dbData.movies && dbData.movies.length > 0) {
      console.log(`📥 开始导入 ${dbData.movies.length} 条电影数据...`);
      for (const movie of dbData.movies) {
        await connection.query(
          `INSERT INTO movies (name, score, image, description, director, actors, releaseDate, genre, \`explain\`, duration, category_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            movie.name || "",
            movie.score || null,
            movie.image || "",
            movie.description || "",
            movie.director || "",
            JSON.stringify(movie.actors || []),
            movie.releaseDate || "",
            JSON.stringify(movie.genre || []),
            movie.explain || "",
            movie.duration || null,
            movie.category_id || "",
          ]
        );
      }
      console.log(`✅ 电影数据导入完成: ${dbData.movies.length} 条`);
    }

    // 导入分类
    if (dbData.categories && dbData.categories.length > 0) {
      for (const cat of dbData.categories) {
        await connection.query("INSERT INTO categories (name) VALUES (?)", [
          cat.name,
        ]);
      }
      console.log(`✅ 分类数据导入完成: ${dbData.categories.length} 条`);
    }

    // 导入轮播图
    if (dbData.carouselImages && dbData.carouselImages.length > 0) {
      for (const img of dbData.carouselImages) {
        await connection.query(
          "INSERT INTO carousel_images (imageUrl) VALUES (?)",
          [img.imageUrl]
        );
      }
      console.log(`✅ 轮播图数据导入完成: ${dbData.carouselImages.length} 条`);
    }

    // 导入公告
    if (dbData.announcements && dbData.announcements.length > 0) {
      for (const ann of dbData.announcements) {
        await connection.query(
          "INSERT INTO announcements (content) VALUES (?)",
          [ann.content]
        );
      }
      console.log(`✅ 公告数据导入完成: ${dbData.announcements.length} 条`);
    }

    // 导入热门电影
    if (dbData.hotMovies && dbData.hotMovies.length > 0) {
      for (const hm of dbData.hotMovies) {
        await connection.query(
          "INSERT INTO hot_movies (title, poster, highlights) VALUES (?, ?, ?)",
          [hm.title, hm.poster || "", hm.highlights || ""]
        );
      }
      console.log(`✅ 热门电影数据导入完成: ${dbData.hotMovies.length} 条`);
    }

    // 导入帖子
    if (dbData.posts && dbData.posts.length > 0) {
      for (const post of dbData.posts) {
        await connection.query(
          "INSERT INTO posts (content, author, time) VALUES (?, ?, ?)",
          [post.content, post.author || "", post.time || ""]
        );
      }
      console.log(`✅ 帖子数据导入完成: ${dbData.posts.length} 条`);
    }

    // 导入用户
    if (dbData.users && dbData.users.length > 0) {
      for (const user of dbData.users) {
        await connection.query(
          `INSERT INTO users (account, password, avatar, nickname, gender, age, addtime, birthday, identity, hobbies, signature, collections, comments)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            user.account || "",
            user.password || "",
            user.avatar || "",
            user.nickname || "",
            user.gender || "male",
            user.age || 18,
            user.addtime || "",
            user.birthday || "",
            user.identity || "普通用户",
            JSON.stringify(user.hobbies || []),
            user.signature || "",
            JSON.stringify(user.collections || []),
            JSON.stringify(user.comments || []),
          ]
        );
      }
      console.log(`✅ 用户数据导入完成: ${dbData.users.length} 条`);
    }

    // 导入排行榜
    if (dbData.rankings && dbData.rankings.length > 0) {
      for (const ranking of dbData.rankings) {
        await connection.query(
          `INSERT INTO rankings (title, src, actors, description, recommendationIndex, comments)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            ranking.title || "",
            ranking.src || "",
            JSON.stringify(ranking.actors || []),
            ranking.description || "",
            ranking.recommendationIndex || 0,
            JSON.stringify(ranking.comments || []),
          ]
        );
      }
      console.log(`✅ 排行榜数据导入完成: ${dbData.rankings.length} 条`);
    }

    // 导入管理员信息
    if (dbData.admininfo && dbData.admininfo.length > 0) {
      for (const admin of dbData.admininfo) {
        await connection.query(
          `INSERT INTO admininfo (username, password, avatar, email, phone, registerDate)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            admin.username || "",
            admin.password || "",
            admin.avatar || "",
            admin.email || "",
            admin.phone || "",
            admin.registerDate || "",
          ]
        );
      }
      console.log(`✅ 管理员信息导入完成: ${dbData.admininfo.length} 条`);
    }

    console.log("🎉 MySQL 数据库初始化完成！");
  } catch (error) {
    console.error("❌ 初始化失败:", error.message);
    throw error;
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

initDatabase().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
