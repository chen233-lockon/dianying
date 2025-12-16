<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-form">
        <h2>用户注册</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="account">用户名</label>
            <input
              type="text"
              id="account"
              v-model="formData.account"
              placeholder="请输入用户名"
              @blur="checkAccount"
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
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              placeholder="请确认密码"
            />
            <span class="error-message" v-if="errors.confirmPassword">{{
              errors.confirmPassword
            }}</span>
          </div>
          <button type="submit" class="register-btn" :disabled="isLoading">
            {{ isLoading ? "注册中..." : "注册" }}
          </button>
        </form>
        <div class="login-link">
          已有账号? <a href="#" @click.prevent="goToLogin">立即登录</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { userAPI } from "@/api/index.js";

const router = useRouter();

// 表单数据
const formData = reactive({
  account: "",
  password: "",
  confirmPassword: "",
});

// 错误信息
const errors = reactive({
  account: "",
  password: "",
  confirmPassword: "",
});

// 加载状态
const isLoading = ref(false);

// 获取当前日期和时间
const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 表单验证
const validateForm = () => {
  let isValid = true;

  // 清除之前的错误
  errors.account = "";
  errors.password = "";
  errors.confirmPassword = "";

  // 验证用户名
  if (!formData.account.trim()) {
    errors.account = "用户名不能为空";
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

  // 验证确认密码
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "两次输入的密码不一致";
    isValid = false;
  }

  return isValid;
};

// 检查用户名是否重复
const checkAccount = async () => {
  if (!formData.account.trim()) return;

  try {
    const response = await userAPI.getUsers();
    const users = response.data;

    const isAccountTaken = users.some(
      (user) => user.account === formData.account
    );

    if (isAccountTaken) {
      errors.account = "用户名已存在";
    }
  } catch (error) {
    console.error("检查用户名失败:", error);
    ElMessage.error("检查用户名失败");
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    const currentDateTime = getCurrentDateTime();

    const response = await userAPI.createUser({
      account: formData.account,
      password: formData.password,
      avatar: "https://picsum.photos/300/450?random=89",
      nickname: "新用户",
      gender: "male",
      age: 18,
      comments: [],
      birthday: "2000-01-01",
      addtime: currentDateTime,
      identity: "普通用户",
      hobbies: ["电影", "音乐"],
      collections: [],
    });

    if (response.data) {
      ElMessage.success("注册成功");
      router.push("/qianlogin");
    }
  } catch (error) {
    console.error("注册失败:", error);
    ElMessage.error("注册失败，请稍后再试");
  } finally {
    isLoading.value = false;
  }
};

// 跳转到登录页面
const goToLogin = () => {
  router.push("/qianlogin");
};
</script>

<style scoped>
/* 全局样式 */
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, sans-serif;
}

.register-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
  max-width: 1200px;
}

.register-form {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 420px;
  transition: all 0.3s ease;
}

.register-form:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

h2 {
  text-align: center;
  margin-bottom: 28px;
  color: #2c3e50;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.5px;
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

.register-btn {
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

.register-btn:hover {
  background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
  box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
  transform: translateY(-2px);
}

.register-btn:disabled {
  background: linear-gradient(135deg, #a0cfff 0%, #85c1ff 100%);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.login-link {
  text-align: center;
  margin-top: 28px;
  font-size: 15px;
  color: #34495e;
}

.login-link a {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.login-link a:hover {
  color: #2980b9;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-container {
    padding: 16px;
  }

  .register-form {
    padding: 32px 24px;
  }

  .register-form:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  h2 {
    font-size: 24px;
    margin-bottom: 24px;
  }
}

@media (max-width: 480px) {
  .register-form {
    padding: 24px 16px;
  }

  h2 {
    font-size: 22px;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  input[type="text"],
  input[type="password"] {
    padding: 12px 14px;
    font-size: 14px;
  }

  .register-btn {
    padding: 12px 0;
    font-size: 15px;
  }
}
</style>
