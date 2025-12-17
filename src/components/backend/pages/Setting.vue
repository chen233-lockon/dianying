<template>
  <div class="setting-container">
    <!-- 头部标题 -->
    <div class="header">
      <h1>
        <el-icon><User /></el-icon> 个人中心
      </h1>
    </div>

    <!-- 用户信息卡片 -->
    <el-card class="user-card">
      <div class="user-profile">
        <div class="avatar-container">
          <el-avatar :size="120" :src="userInfo.avatar" />
          <el-upload
            class="avatar-upload"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <el-button type="primary" plain size="small">
              <el-icon><Edit /></el-icon> 更换头像
            </el-button>
          </el-upload>
        </div>

        <div class="user-info">
          <h2>{{ userInfo.username }}</h2>
          <div class="info-item">
            <el-icon><User /></el-icon>
            <span>管理员</span>
          </div>
          <div class="info-item">
            <el-icon><Calendar /></el-icon>
            <span>注册时间：{{ userInfo.registerDate }}</span>
          </div>
          <div class="info-item">
            <el-icon><Clock /></el-icon>
            <span>上次登录：{{ userInfo.lastLogin }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 信息编辑区 -->
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>个人信息设置</span>
        </div>
      </template>

      <el-form :model="form" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveProfile">
            <el-icon><Check /></el-icon> 保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 密码修改区 -->
    <el-card class="password-card">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
        </div>
      </template>

      <el-form
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordFormRef"
        label-width="120px"
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            type="password"
            v-model="passwordForm.currentPassword"
            show-password
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            v-model="passwordForm.newPassword"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            type="password"
            v-model="passwordForm.confirmPassword"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="changePassword">
            <el-icon><Refresh /></el-icon> 更新密码
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作日志 -->
    <el-card class="log-card">
      <template #header>
        <div class="card-header">
          <span>最近操作记录</span>
        </div>
      </template>

      <el-timeline>
        <el-timeline-item
          v-for="(log, index) in operationLogs"
          :key="index"
          :timestamp="log.time"
          hollow="true"
          type="primary"
        >
          {{ log.action }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import {
  User,
  Calendar,
  Clock,
  Edit,
  Check,
  Refresh,
} from "@element-plus/icons-vue";

import { useUserStore } from "../../../stores/user";
import { addOperationLog } from "../../../utils/operationLog";
import { useRouter } from "vue-router";
import { adminAPI, uploadAPI, operationLogAPI } from "@/api/index.js";

const router = useRouter();
const userStore = useUserStore();
const admin = userStore.adminProfile;

// 用户信息
const userInfo = reactive({
  username: admin.username,
  avatar: admin.avatar,
  registerDate: admin.registerDate,
  lastLogin: userStore.loginInfo?.loginTime || "--",
  email: admin.email,
  phone: admin.phone,
});

// 编辑表单
const form = reactive({ ...userInfo });

// 密码表单
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// 表单引用与校验规则
const passwordFormRef = ref();
const passwordRules = reactive({
  currentPassword: [
    { required: true, message: "请输入当前密码", trigger: "blur" },
  ],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "密码长度至少6位", trigger: "blur" },
  ],
  confirmPassword: [
    {
      validator: (_rule, value, callback) => {
        if (!value) return callback(new Error("请再次输入新密码"));
        if (value !== passwordForm.newPassword)
          return callback(new Error("两次输入的密码不一致"));
        callback();
      },
      trigger: "blur",
    },
  ],
});

// 操作日志
const operationLogs = ref([]);

// 头像上传处理
const beforeAvatarUpload = async (file) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("请上传图片格式文件!");
    return false;
  }

  try {
    // 创建FormData对象并添加文件
    const formData = new FormData();
    formData.append("avatar", file);

    // 使用uploadAPI上传头像
    const uploadResponse = await uploadAPI.uploadAvatar(formData);

    const avatarUrl = uploadResponse.data.url; // 获取服务器返回的URL

    // 使用adminAPI更新头像链接
    await adminAPI.updateAdmin(admin.id, {
      avatar: avatarUrl,
    });

    // 更新store和本地显示
    userStore.adminProfile.avatar = avatarUrl;
    userInfo.avatar = avatarUrl;

    ElMessage.success("头像更新成功!");
  } catch (error) {
    ElMessage.error("头像更新失败: " + error.message);
  }

  return false; // 不使用默认上传
};

// 保存个人资料
const saveProfile = async () => {
  try {
    // 使用adminAPI更新个人资料
    await adminAPI.updateAdmin(admin.id, {
      username: form.username,
      email: form.email,
      phone: form.phone,
    });

    // 更新store
    userStore.adminProfile.username = form.username;
    userStore.adminProfile.email = form.email;
    userStore.adminProfile.phone = form.phone;

    // 更新本地显示
    Object.assign(userInfo, form);

    operationLogs.value.unshift({
      action: "修改了个人资料",
      time: new Date().toLocaleString(),
    });
    ElMessage.success("个人信息已更新!");

    await addOperationLog("修改了个人资料");
  } catch (error) {
    ElMessage.error("更新失败: " + error.message);
  }
};

// 修改密码
const changePassword = async () => {
  try {
    // 基本校验
    if (!userStore.adminProfile?.id) {
      // 尝试加载管理员信息
      try {
        await userStore.loadAdminProfile();
      } catch (_) {}
    }

    const adminId = userStore.adminProfile?.id;
    if (!adminId) {
      throw new Error("未获取到管理员信息，请重新登录");
    }

    // 表单规则校验
    if (passwordFormRef.value) {
      await passwordFormRef.value.validate();
    }

    // 使用adminAPI获取当前密码进行验证
    const response = await adminAPI.getAdmin(adminId);
    const currentAdmin = response.data;

    if (passwordForm.currentPassword !== currentAdmin.password) {
      throw new Error("当前密码输入错误");
    }

    // 使用adminAPI更新密码
    await adminAPI.updateAdmin(adminId, { password: passwordForm.newPassword });

    ElMessage.success("密码已更新，请重新登录");
    setTimeout(() => {
      userStore.clearLoginInfo();
      localStorage.removeItem("token");
      router.push({ name: "login" });
    }, 1500);
    await addOperationLog("更新了登录密码");
  } catch (error) {
    ElMessage.error(error.message || "密码更新失败");
  }
};

// 加载操作日志（使用本地存储）
onMounted(async () => {
  try {
    // 从localStorage获取操作日志
    const localLogs = localStorage.getItem("operationLogs");
    if (localLogs) {
      const logs = JSON.parse(localLogs);
      operationLogs.value = logs.slice(0, 10); // 只显示最近10条
    }
  } catch (error) {
    console.error("加载操作日志失败:", error);
  }
});
</script>
<style lang="scss" scoped>
.setting-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--el-color-primary);
    }
  }

  .user-card {
    margin-bottom: 20px;

    .user-profile {
      display: flex;
      gap: 30px;
      padding: 15px;

      .avatar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      .user-info {
        h2 {
          margin-top: 0;
          margin-bottom: 15px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          color: var(--el-text-color-regular);
        }
      }
    }
  }

  .form-card,
  .password-card,
  .log-card {
    margin-bottom: 20px;

    .card-header {
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }
}

@media (max-width: 768px) {
  .user-profile {
    flex-direction: column;
    align-items: center;
    text-align: center;

    .user-info .info-item {
      justify-content: center;
    }
  }
}
</style>
