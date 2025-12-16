<template>
  <el-row>
    <el-col class="aside">
      <el-menu
        active-text-color="#white"
        class="el-menu-vertical-demo"
        :default-active="active"
        text-color="#333"
      >
        <!-- 首页 -->
        <router-link :to="{ name: 'index' }">
          <el-menu-item index="1">
            <el-icon>
              <HomeFilled />
            </el-icon>
            <span>首页</span>
          </el-menu-item>
        </router-link>
        <!-- 分类管理 -->
        <router-link :to="{ name: 'category' }">
          <el-menu-item index="2">
            <el-icon>
              <List />
            </el-icon>
            <span>分类管理</span>
          </el-menu-item>
        </router-link>
        <!-- 商品管理 -->
        <router-link :to="{ name: 'goods' }">
          <el-menu-item index="3">
            <el-icon>
              <List />
            </el-icon>
            <span>电影管理</span>
          </el-menu-item>
        </router-link>
        <!-- 个人中心 -->
        <router-link :to="{ name: 'setting' }">
          <el-menu-item index="4">
            <el-icon>
              <Setting />
            </el-icon>
            <span>个人中心</span>
          </el-menu-item>
        </router-link>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup>
import { HomeFilled, Setting, List } from "@element-plus/icons-vue";
import { ref } from "vue";
import router from "../../../router/router";
const menuIndex = {
  index: "1",
  category: "2",
  goods: "3",
  setting: "4",
};
const active = ref(menuIndex[router.currentRoute.value.name] || "0");
</script>

<style lang="scss" scoped>
.el-menu {
  border: 0 !important;
  background-color: #f5fafb; // 新增浅色背景提升对比度

  .is-active {
    background: #4eacaf !important; // 主色替换为纯色
    span {
      color: white !important;
    }
    .el-icon {
      color: white !important;
    }
  }

  a {
    text-decoration: none;
    &:hover {
      background-color: #e0f2f3; // 新增悬停效果
    }
  }

  // 统一图标颜色
  .el-icon {
    color: #4eacaf;
  }
}
</style>
