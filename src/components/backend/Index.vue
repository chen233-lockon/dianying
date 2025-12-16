<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside>
          <Aside></Aside>
        </el-aside>
        <el-main>
          <el-card class="box-card">
            <router-view></router-view>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import Header from "./Layout/Header.vue";
import Aside from "./Layout/Aside.vue";
import { onMounted } from "vue";
import { useUserStore } from "../../../src/stores/user";

const userStore = useUserStore();

onMounted(async () => {
  if (userStore.isAuthenticated) {
    // 刷新后重新加载管理员信息（触发定位）
    await userStore.loadAdminProfile();
  }
});
</script>
<style lang="scss" scoped>
.el-container {
  height: 100%;

  .el-header {
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      from(#21878b),
      to(#4eacaf)
    );
    text-align: center;
    line-height: 60px;
    color: #333;
  }

  .el-aside {
    width: 200px;
    height: 100%;
    color: #333;
    background: white;
  }

  .el-main {
    height: 100vh;
    background-color: #e9eef3;
    color: #333;
  }
}
</style>
