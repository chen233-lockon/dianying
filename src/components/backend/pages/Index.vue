<script setup>
import { onMounted } from "vue";
import { Memo } from "@element-plus/icons-vue";
import * as echarts from "echarts";
import { useUserStore } from "../../../stores/user";
import { useCategoryStore } from "../../../stores/category";
import { useMovieStore } from "../../../stores/movieStore";
import { useUsersStore } from "../../../stores/users";

const adminStore = useUserStore();
const categoryStore = useCategoryStore();
const movieStore = useMovieStore();
const usersStore = useUsersStore();
onMounted(async () => {
  // 先获取初始数据
  await movieStore.fetchMovies();
  await categoryStore.fetchCategories();
  await usersStore.fetchUsers();

  initCharts1();
  initCharts2();
});
// 图表 1：月度浏览量
const initCharts1 = () => {
  const myChart = echarts.init(document.getElementById("salesVolume"));
  myChart.setOption({
    color: ["#4eacaf"],
    title: { text: "2024 年月度用户浏览量" },
    xAxis: {
      data: [
        "1 月",
        "2 月",
        "3 月",
        "4 月",
        "5 月",
        "6 月",
        "7 月",
        "8 月",
        "9月",
        "10 月",
        "11 月",
        "12 月",
      ],
      name: "月份",
      axisLabel: {
        interval: 0,
      },
    },
    yAxis: {
      name: "次",
    },
    grid: {
      left: "3%",
      right: "8%",
      bottom: "5%",
      containLabel: true,
    },
    legend: {},
    series: [
      {
        data: [6, 7, 8.5, 8, 9, 10, 13, 12, 10, 16, 15, 14],
        type: "line",
        name: "浏览量",
        smooth: true,
        label: {
          show: true,
          position: "top",
        },
      },
    ],
  });
  // 图表自适应大小
  window.onresize = () => {
    myChart.resize();
  };
};
// 图表 2：年评论数量
const initCharts2 = () => {
  const myChart = echarts.init(document.getElementById("orderQuantity"));
  myChart.setOption({
    title: { text: "2024 年评论数量" },
    color: ["#4eacaf"],
    grid: {
      left: "3%",
      right: "8%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: [
        "1 月",
        "2 月",
        "3 月",
        "4 月",
        "5 月",
        "6 月",
        "7 月",
        "8 月",
        "9月",
        "10 月",
        "11 月",
        "12 月",
      ],
      name: "月份",
      // 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        interval: 0,
        rotate: 45, // 设置刻度标签旋转角度为 45 度
      },
    },
    legend: {},
    yAxis: {
      name: "单位（条）",
    },
    series: [
      {
        data: [400, 450, 300, 230, 250, 300, 400, 350, 160, 350, 380, 400],
        type: "bar",
        barWidth: "60%",
        name: "评论总数",
        label: {
          show: true,
          position: "top",
        },
      },
    ],
  });
  // 图表自适应大小
  window.onresize = () => {
    myChart.resize();
  };
};
</script>
<template>
  <h3>首页</h3>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <!-- <el-avatar
              class="avatar"
              :src="admin.avatar"
              shape="square"
              :size="40"
            >
            </el-avatar> -->
            <!-- <span style="font-size: 24px">{{ admin.username }} </span> -->
          </div>
        </template>
        <div class="info">
          <p>登录时间：{{ adminStore.loginInfo?.loginTime || "--" }}</p>
          <p>登录地点：{{ adminStore.loginInfo?.loginPlace || "--" }}</p>
        </div>
      </el-card>
    </el-col>
    <!-- 单月统计信息展示 -->
    <el-col :span="18">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            {{ adminStore.loginInfo?.mounth || "--" }}统计信息
          </div>
        </template>
        <div class="info">
          <el-row :gutter="24">
            <!-- 电影数量 -->
            <el-col :span="8">
              <div class="card-container">
                <div
                  class="card-left-container"
                  style="background-color: #eead0e"
                >
                  <el-icon :size="90">
                    <Memo />
                  </el-icon>
                </div>
                <div class="card-right-container">
                  <p class="number">{{ movieStore.movies.length }}</p>
                  <p>电影数量(部)</p>
                </div>
              </div>
            </el-col>
            <!-- 电影分类数量 -->
            <el-col :span="8">
              <div class="card-container">
                <div
                  class="card-left-container"
                  style="background-color: #ab82ff"
                >
                  <el-icon :size="90">
                    <Memo />
                  </el-icon>
                </div>
                <div class="card-right-container">
                  <p class="number">{{ categoryStore.categories.length }}</p>
                  <p>电影分类数量(种)</p>
                </div>
              </div>
            </el-col>
            <!-- 用户访问次数 -->
            <el-col :span="8">
              <div class="card-container">
                <div
                  class="card-left-container"
                  style="background-color: #63b8ff"
                >
                  <el-icon :size="90">
                    <Memo />
                  </el-icon>
                </div>
                <div class="card-right-container">
                  <p class="number">{{ usersStore.count }}</p>
                  <p>注册用户(个)</p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <!-- 图表区域 -->
  <el-row :gutter="20">
    <el-col :span="12">
      <!-- 通过折线图展示 2022 年月度销售额 -->
      <el-card class="box-card">
        <div id="salesVolume" style="width: auto; height: 400px"></div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <!-- 通过柱状图展示 2022 年订单数量 -->
      <el-card class="box-card">
        <div id="orderQuantity" style="width: auto; height: 400px"></div>
      </el-card>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  .el-col {
    .box-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .info {
        font-size: 14px;
      }
    }
  }
}

.card-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e4e7ed;
  text-align: center;
  padding-right: 20px;

  .card-left-container {
    color: white;
  }

  .card-right-container {
    .number {
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
