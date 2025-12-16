const axios = require("axios");

async function testFavoritesAPI() {
  const baseURL = "http://localhost:3000";
  const userId = 7;
  const movieId = 1;

  console.log("🧪 测试收藏API...\n");

  try {
    // 测试1: 获取用户收藏列表
    console.log(`1️⃣ 获取用户 ${userId} 的收藏列表...`);
    const getFavoritesRes = await axios.get(
      `${baseURL}/users/${userId}/favorites`
    );
    console.log("✅ 成功:", getFavoritesRes.data);
    console.log();

    // 测试2: 添加收藏
    console.log(`2️⃣ 添加电影 ${movieId} 到收藏...`);
    const addRes = await axios.post(`${baseURL}/users/${userId}/favorites`, {
      movieId,
    });
    console.log("✅ 成功:", addRes.data);
    console.log();

    // 测试3: 再次获取收藏列表
    console.log(`3️⃣ 再次获取收藏列表...`);
    const getFavoritesRes2 = await axios.get(
      `${baseURL}/users/${userId}/favorites`
    );
    console.log("✅ 成功:", getFavoritesRes2.data);
    console.log();

    // 测试4: 取消收藏
    console.log(`4️⃣ 取消收藏电影 ${movieId}...`);
    const removeRes = await axios.delete(
      `${baseURL}/users/${userId}/favorites/${movieId}`
    );
    console.log("✅ 成功:", removeRes.data);
    console.log();

    // 测试5: 最后获取收藏列表
    console.log(`5️⃣ 最后获取收藏列表...`);
    const getFavoritesRes3 = await axios.get(
      `${baseURL}/users/${userId}/favorites`
    );
    console.log("✅ 成功:", getFavoritesRes3.data);
    console.log();

    console.log("🎉 所有测试通过！");
  } catch (error) {
    console.error("❌ 测试失败:", error.response?.data || error.message);
    console.error("请求URL:", error.config?.url);
    console.error("请求方法:", error.config?.method);
  }
}

testFavoritesAPI();
