<template>
  <div></div>
  <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false">
    <div class="navbar">电影信息后台管理系统</div>
    <el-dropdown class="menu" v-if="admin">
      <span class="el-dropdown-link">
        <el-avatar
          class="avatar"
          size="small"
          :src="admin.avatar"
          :key="admin.avatar"
        />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item class="ziliao" @click="transpage">
            <el-icon><User /></el-icon>个人中心
          </el-dropdown-item>
          <el-dropdown-item class="btn btn-light" @click="onLogout">
            <el-icon><Close /></el-icon>退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-menu>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../../stores/user";

const router = useRouter();
const userStore = useUserStore();
const admin = ref(null);

onMounted(async () => {
  // 如果已经登录，从store中获取管理员信息
  if (userStore.isAuthenticated) {
    admin.value = userStore.adminProfile;
  } else {
    // 尝试从本地存储恢复登录状态
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await userStore.loadAdminProfile();
        admin.value = userStore.adminProfile;
      } catch (error) {
        console.error("加载管理员信息失败:", error);
        localStorage.removeItem("token");
      }
    }
  }
});

const transpage = () => {
  router.push({ name: "setting" });
};

const onLogout = async () => {
  userStore.clearLoginInfo();
  localStorage.removeItem("token");
  router.push("/");
};
</script>

<style scoped lang="scss">
.el-menu-demo {
  display: flex;
  justify-content: space-between;
  background: linear-gradient(90deg, #21878b, #4eacaf);
  box-shadow: 0 2px 8px rgba(33, 135, 139, 0.2); // 新增投影增强层次
  padding: 0 24px; // 增加左右内边距

  .navbar {
    color: white;
    font-size: 22px; // 增大字号
    font-weight: 600;
    letter-spacing: 1.5px; // 增加字间距
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); // 文字投影
  }

  .menu {
    .el-dropdown-link {
      display: flex;
      align-items: center;
      padding: 0 8px;
      transition: all 0.3s;

      &:hover {
        background: rgba(255, 255, 255, 0.15); // 悬停透明效果
        border-radius: 4px;
      }

      .avatar {
        border: 2px solid rgba(255, 255, 255, 0.9); // 头像白边框
      }
    }
  }
}

// 下拉菜单深度样式
.el-dropdown-menu {
  border: 1px solid #e6f4f5 !important; // 浅色边框
  min-width: 140px;

  .el-dropdown-menu__item {
    color: #4eacaf !important; // 文字主题色
    padding: 8px 16px;
    transition: all 0.3s;

    .el-icon {
      color: #4eacaf !important; // 图标主题色
      margin-right: 8px;
      font-size: 16px;
    }

    &:hover {
      background: #e6f4f5 !important; // 悬停浅色背景
      transform: translateX(2px); // 微移动效
    }

    &.btn-light {
      color: #e65d6e !important; // 退出按钮强调色
      .el-icon {
        color: #e65d6e !important;
      }
    }
  }
}
</style>
