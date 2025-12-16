<template>
  <div>
    <div
      style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center"
    >
      <el-input
        v-model="searchKeyword"
        placeholder="搜索电影名称、导演..."
        clearable
        style="width: 300px"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="openDialog">
        <el-icon><Plus /></el-icon>
        新增电影
      </el-button>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="form.id ? '修改电影' : '新增电影'"
      @closed="resetForm"
    >
      <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
        <el-form-item label="电影名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="评分" prop="score">
          <el-input-number
            v-model="form.score"
            :min="0"
            :max="10"
            :step="0.1"
            :precision="1"
            controls-position="right"
          />
        </el-form-item>

        <el-form-item label="上映日期" prop="releaseDate">
          <el-date-picker
            v-model="form.releaseDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="时长(分钟)" prop="duration">
          <el-input-number
            v-model="form.duration"
            :min="1"
            :max="300"
            controls-position="right"
          />
        </el-form-item>

        <el-form-item label="海报URL" prop="image">
          <el-input v-model="form.image" />
        </el-form-item>

        <el-form-item label="导演" prop="director">
          <el-input v-model="form.director" />
        </el-form-item>

        <el-form-item label="类型" prop="genre">
          <el-input
            v-model="form.genre"
            placeholder="使用'/'分隔类型，如：动画/动作"
          />
        </el-form-item>

        <el-form-item label="演员" prop="actors">
          <el-select
            v-model="form.actors"
            multiple
            filterable
            allow-create
            placeholder="输入演员后按回车"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入电影简介"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 电影列表 -->
    <el-table
      :data="displayedMovies"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <template #empty>
        <el-empty description="暂无电影数据" />
      </template>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" width="180" />

      <el-table-column label="评分" width="120">
        <template #default="{ row }">
          <el-rate
            :model-value="(Number(row.score) || 0) / 2"
            disabled
            allow-half
            :max="5"
          />
          <span style="margin-left: 8px">{{
            (Number(row.score) || 0).toFixed(1)
          }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="director" label="导演" width="120" />

      <el-table-column label="类型" width="150">
        <template #default="{ row }">
          <el-tag
            v-for="(genre, index) in formatGenre(row.genre)"
            :key="index"
            type="info"
            size="small"
            style="margin: 2px"
          >
            {{ genre }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="海报" width="120">
        <template #default="{ row }">
          <el-image
            :src="row.image"
            style="height: 80px"
            fit="cover"
            :preview-src-list="[row.image]"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="warning" size="small" @click="editMovie(row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="deleteMovie(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="margin-top: 20px">
      <el-pagination
        v-model:current-page="movieStore.pagination.page"
        v-model:page-size="movieStore.pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="movieStore.pagination.total"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onActivated } from "vue";
import { ElMessage } from "element-plus";
import { useMovieStore } from "../../../stores/movieStore";
import { addOperationLog } from "../../../utils/operationLog";

const movieStore = useMovieStore();
const dialogVisible = ref(false);
const formRef = ref(null);
const searchKeyword = ref("");
const loading = ref(false);

// 计算属性：过滤后的电影列表
const displayedMovies = computed(() => {
  if (!Array.isArray(movieStore.movies)) {
    console.warn("movieStore.movies 不是数组:", movieStore.movies);
    return [];
  }

  if (!searchKeyword.value) {
    return movieStore.movies;
  }

  const keyword = searchKeyword.value.toLowerCase();
  return movieStore.movies.filter(
    (movie) =>
      movie.name?.toLowerCase().includes(keyword) ||
      movie.director?.toLowerCase().includes(keyword) ||
      movie.description?.toLowerCase().includes(keyword)
  );
});

console.log(movieStore.pagination.page);
console.log(movieStore.pagination.pageSize);
console.log(movieStore.pagination.total);

const form = reactive({
  name: "",
  score: 8.0,
  duration: 120,
  image: "",
  director: "",
  genre: "",
  actors: [],
  releaseDate: "",
  description: "",
});

const rules = reactive({
  name: [{ required: true, message: "请输入电影名称", trigger: "blur" }],
  score: [
    { required: true, message: "请输入评分", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 10,
      message: "评分范围 0-10",
      trigger: "blur",
    },
  ],
  duration: [
    { required: true, message: "请输入时长", trigger: "blur" },
    {
      type: "number",
      min: 1,
      max: 300,
      message: "时长范围 1-300 分钟",
      trigger: "blur",
    },
  ],
  genre: [
    { required: true, message: "请输入电影类型", trigger: "blur" },
    {
      pattern: /.+\/.+/,
      message: "至少包含一个'/'分隔符",
      trigger: "blur",
    },
  ],
});

// 初始化加载数据
onMounted(() => {
  movieStore.fetchMovies();
});

// 页面激活时刷新数据（从其他页面切换回来时）
onActivated(() => {
  movieStore.fetchMovies();
});

const openDialog = () => {
  dialogVisible.value = true;
};

const editMovie = (movie) => {
  // 确保正确复制所有字段
  Object.assign(form, {
    id: movie.id,
    name: movie.name,
    score: movie.score,
    duration: movie.duration,
    image: movie.image,
    director: movie.director,
    genre: Array.isArray(movie.genre)
      ? movie.genre.join("/")
      : movie.genre || "",
    actors: Array.isArray(movie.actors) ? movie.actors : [],
    releaseDate: movie.releaseDate,
    description: movie.description,
  });
  dialogVisible.value = true;
};

const deleteMovie = async (id) => {
  try {
    const movie = movieStore.movies.find((m) => m.id === id);
    const movieName = movie ? movie.name : "Unknown";
    await movieStore.deleteMovie(id);
    ElMessage.success("删除成功");
    await addOperationLog(`删除了电影：${movieName}`);
  } catch (error) {
    ElMessage.error("删除失败: " + error.message);
  }
};

const handleSearch = () => {
  // 搜索时重置到第一页
  movieStore.pagination.page = 1;
};

const handleSizeChange = (size) => {
  movieStore.pagination.pageSize = size;
  movieStore.pagination.page = 1;
  movieStore.fetchMovies();
};

const handlePageChange = (page) => {
  movieStore.pagination.page = page;
  movieStore.fetchMovies();
};

const formatGenre = (genre) => {
  if (!genre) return [];
  if (Array.isArray(genre)) {
    return genre.filter((g) => g && g.trim());
  }
  return genre
    .split("/")
    .map((g) => g.trim())
    .filter((g) => g);
};

const submitForm = async () => {
  try {
    if (!formRef.value) {
      ElMessage.error("表单未初始化");
      return;
    }

    await formRef.value.validate();

    const movieData = {
      ...form,
      genre: form.genre.split("/").map((g) => g.trim()),
    };

    if (form.id) {
      await movieStore.updateMovie(form.id, movieData);
      ElMessage.success("更新成功");
    } else {
      await movieStore.createMovie(movieData);
      ElMessage.success("创建成功");
    }

    dialogVisible.value = false;
    // 确保关闭对话框后数据已经更新
    await movieStore.fetchMovies();
  } catch (error) {
    console.error("提交失败:", error);
    if (error.message) {
      ElMessage.error("操作失败: " + error.message);
    }
  }
};

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  // 重置表单数据
  Object.assign(form, {
    id: "",
    name: "",
    score: 8.0,
    duration: 120,
    image: "",
    director: "",
    genre: "",
    actors: [],
    releaseDate: "",
    description: "",
  });
};
</script>

<style scoped>
/* 统一主题色 */
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;
}

/* 表格优化 */
.el-table {
  margin-top: 15px;
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
  --el-table-row-hover-bg-color: #f5f7fa;
}

.el-table :deep(th.el-table__cell) {
  font-weight: 600;
  color: #303133;
  background-color: var(--el-table-header-bg-color);
}

.el-table :deep(.el-table__row--striped) {
  background-color: #fafafa;
}

/* 分页深度优化 */
.el-pagination {
  margin-top: 20px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  --el-pagination-button-disabled-bg-color: transparent;
  --el-pagination-bg-color: #f5f7fa;
  --el-pagination-button-color: #606266;
}

.el-pagination.is-background :deep(.btn-next),
.el-pagination.is-background :deep(.btn-prev),
.el-pagination.is-background :deep(.el-pager li) {
  border-radius: 6px;
  margin: 0 4px;
  min-width: 32px;
  height: 32px;
  transition: all 0.2s;
}

.el-pagination.is-background :deep(.el-pager li:not(.is-disabled).is-active) {
  background-color: var(--primary-color);
  color: #fff;
}

.el-pagination.is-background :deep(.number:hover) {
  color: var(--primary-color);
}

/* 海报图片优化 */
.el-image {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  cursor: zoom-in;
}

.el-image:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 标签样式升级 */
.el-tag {
  --el-tag-border-radius: 12px;
  --el-tag-font-size: 12px;
  margin: 4px;
  padding: 0 10px;
  height: 24px;
  line-height: 22px;
  background-color: rgba(64, 158, 255, 0.1);
  border-color: rgba(64, 158, 255, 0.2);
  color: var(--primary-color);
}

.el-tag + .el-tag {
  margin-left: 6px;
}

/* 按钮交互优化 */
.el-button {
  transition: all 0.2s;
  border-radius: 6px;
  padding: 8px 16px;
}

.el-button + .el-button {
  margin-left: 10px;
}

.el-button--primary:not(:disabled):hover {
  background-color: #337ecc;
  border-color: #337ecc;
  transform: translateY(-1px);
}

.el-button--danger:not(:disabled):hover {
  background-color: #f54e4e;
  border-color: #f54e4e;
  transform: translateY(-1px);
}

/* 对话框标题样式 */
.el-dialog__header {
  border-bottom: 1px solid #eee;
  margin-right: 0;
}

.el-dialog__title {
  font-weight: 600;
  color: #303133;
}

/* 表单标签样式 */
.el-form-item__label {
  color: #606266;
  font-weight: 500;
}

/* 输入框聚焦效果 */
.el-input :deep(.el-input__wrapper) {
  transition: box-shadow 0.2s;
}

.el-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--primary-color) inset;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .el-table {
    overflow-x: auto;
    display: block;
  }

  .el-pagination {
    flex-wrap: wrap;
    justify-content: center;
    padding: 8px;
  }

  .el-pagination :deep(.btn-prev),
  .el-pagination :deep(.btn-next) {
    margin: 4px;
  }
}
</style>
