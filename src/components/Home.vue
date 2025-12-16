<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <my-header></my-header>

    <!-- 底部 -->
    <my-footer></my-footer>
  </div>
</template>

<script setup>
// 头部区域组件
import MyHeader from "./subcomponents/Layout/MyHeader.vue";
//底部区域组件
import MyFooter from "./subcomponents/Layout/MyFooter.vue";
</script>

<style lang="less">
html,
body {
  height: 100vh;
  margin-bottom: 50px;
}
</style>
