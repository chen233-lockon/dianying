<template>
  <div class="login-container">
    <div class="login-card">
      <div class="avatar-container">
        <img
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          alt=""
          class="avatar"
        />
      </div>

      <form class="form-login" @submit.prevent="onLogin">
        <!-- 登录名称 -->
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            id="username"
            placeholder="请输入用户名称"
            autocomplete="off"
            v-model.trim="username"
          />
        </div>
        <!-- 登录密码 -->
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            id="password"
            placeholder="请输入登录密码"
            v-model.trim="password"
          />
        </div>
        <div class="form-group">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" /> 记住密码
          </label>
        </div>
        <div class="form-group" id="login-button">
          <button type="submit" class="btn">
            <el-icon><Pointer /></el-icon>登录
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import axios from "axios";
import { adminAPI } from "@/api/index.js";
const router = useRouter();
const username = ref("");
const password = ref("");
const rememberMe = ref(false);
const loginError = ref(null);

const userStore = useUserStore();

onMounted(() => {
  const savedUsername = localStorage.getItem("rememberedUsername");
  const savedPassword = localStorage.getItem("rememberedPassword");
  if (savedUsername && savedPassword) {
    username.value = savedUsername;
    password.value = savedPassword;
    rememberMe.value = true; // 自动勾选复选框
  }
});

const onLogin = async () => {
  try {
    loginError.value = null;

    // 验证用户凭据
    const response = await adminAPI.getAdmins();

    const admin = response.data.find(
      (a) => a.username === username.value && a.password === password.value
    );

    if (!admin) {
      throw new Error("用户名或密码错误");

    // 保存登录状态
    if (rememberMe.value) {
      localStorage.setItem("rememberedUsername", username.value);
      localStorage.setItem("rememberedPassword", password.value);
    } else {
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberedPassword");
    }

    // 存储管理员信息
    userStore.setAdminProfile(admin);

    // 设置登录信息
    await userStore.setLoginInfo();

    // 导航到首页
    router.push({ name: "index" });
  } catch (error) {
    loginError.value = error.message || "登录失败，请重试";
    localStorage.removeItem("token");
  }
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f2f5;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  margin: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  input {
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      // border-color: #3b82f6;
      border-color: #59c3c6;
    }
  }
}

#login-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  .btn {
    width: 100%;
    background-color: #59c3c6;
    border: none;
    border-radius: 6px;
    padding: 1rem;
    font-size: 1rem;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #bbcfcf;
    }
  }
}
.avatar-box {
  text-align: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #59c3c6;
  }
}
</style>
