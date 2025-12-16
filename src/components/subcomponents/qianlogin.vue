<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h2>用户登录</h2>
        <a href="#" class="back-to-home" @click.prevent="goToHome">
          <el-icon><ArrowLeft /></el-icon> 返回首页
        </a>
      </div>
      <div class="login-form">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="account">账号</label>
            <input
              type="text"
              id="account"
              v-model="formData.account"
              placeholder="请输入账号"
            />
            <span class="error-message" v-if="errors.account">{{
              errors.account
            }}</span>
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              placeholder="请输入密码"
            />
            <span class="error-message" v-if="errors.password">{{
              errors.password
            }}</span>
          </div>
          <div class="form-options">
            <div class="remember-me">
              <input
                type="checkbox"
                id="remember"
                v-model="formData.remember"
              />
              <label for="remember">记住我</label>
            </div>
          </div>
          <button type="submit" class="login-btn" :disabled="isLoading">
            {{ isLoading ? "登录中..." : "登录" }}
          </button>
        </form>
        <div class="register-link">
          还没有账号? <a href="#" @click.prevent="goToRegister">立即注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { ArrowLeft } from "@element-plus/icons-vue";
import { userAPI } from "@/api/index.js";

const router = useRouter();
const authStore = useAuthStore();

// 表单数据
const formData = reactive({
  account: "",
  password: "",
  remember: false,
});

// 错误信息
const errors = reactive({
  account: "",
  password: "",
});

// 加载状态
const isLoading = ref(false);

// 表单验证
const validateForm = () => {
  let isValid = true;

  // 清除之前的错误
  errors.account = "";
  errors.password = "";

  // 验证账号
  if (!formData.account.trim()) {
    errors.account = "账号不能为空";
    isValid = false;
  }

  // 验证密码
  if (!formData.password) {
    errors.password = "密码不能为空";
    isValid = false;
  } else if (formData.password.length < 6) {
    errors.password = "密码长度不能少于6位";
    isValid = false;
  }

  return isValid;
};

// 提交表单
const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    //获取用户数据
    const response = await userAPI.getUsers();
    const users = response.data;

    // 查找匹配的用户
    const user = users.find(
      (u) => u.account === formData.account && u.password === formData.password
    );

    if (user) {
      // 保存用户信息和登录状态到 localStorage
      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");

      // 更新全局状态
      authStore.setUser(user);
      authStore.setIsLoggedIn(true);

      // 跳转到首页
      router.replace("/home/homepage");
    } else {
      errors.account = "账号或密码错误";
    }
  } catch (error) {
    console.error("登录失败:", error);
    alert("登录失败，请检查网络连接或稍后再试");
  } finally {
    isLoading.value = false;
  }
};

// 跳转到注册页面
const goToRegister = () => {
  router.push("/register");
};

// 返回首页
const goToHome = () => {
  router.push("/home/homepage");
};
</script>

<style scoped>
/* 全局样式 */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, sans-serif;
}

.login-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
  max-width: 1200px;
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.login-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.back-to-home {
  display: flex;
  align-items: center;
  color: #3498db;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: rgba(52, 152, 219, 0.1);
}

.back-to-home:hover {
  color: #2980b9;
  background-color: rgba(52, 152, 219, 0.2);
  text-decoration: none;
}

.back-to-home .el-icon {
  margin-right: 6px;
  font-size: 16px;
}

.login-form {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 420px;
  transition: all 0.3s ease;
}

.login-form:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

h2 {
  text-align: center;
  margin-bottom: 28px;
  color: #2c3e50;
  font-size: 26px;
  font-weight: 700;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 10px;
  color: #34495e;
  font-size: 15px;
  font-weight: 500;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s;
  box-sizing: border-box;
  background-color: #f8f9fa;
}

input[type="text"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  background-color: white;
}

.error-message {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 6px;
  display: block;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.remember-me {
  display: flex;
  /* align-items: center; */
}

.remember-me input {
  margin-right: 10px;
  accent-color: #3498db;
  width: 16px;
  height: 16px;
  padding: 0px;
}

.forgot-password {
  color: #3498db;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s;
}

.forgot-password:hover {
  color: #2980b9;
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 14px 0;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
}

.login-btn:hover {
  background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
  box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
  transform: translateY(-2px);
}

.login-btn:disabled {
  background: linear-gradient(135deg, #a0cfff 0%, #85c1ff 100%);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.register-link {
  text-align: center;
  margin-top: 28px;
  font-size: 15px;
  color: #34495e;
}

.register-link a {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.register-link a:hover {
  color: #2980b9;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 16px;
  }

  .login-form {
    padding: 32px 24px;
  }

  .login-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .back-to-home {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .login-form {
    padding: 24px 16px;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 24px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  input[type="text"],
  input[type="password"] {
    padding: 12px 14px;
    font-size: 14px;
  }

  .login-btn {
    padding: 12px 0;
    font-size: 15px;
  }
}
</style>
