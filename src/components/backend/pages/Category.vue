<template>
  <div class="category-management">
    <!-- 头部区域 -->
    <div class="header">
      <h1>
        <el-icon><Folder /></el-icon> 电影分类管理
      </h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon> 添加分类
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <el-card class="stat-card">
      <div class="stat-content">
        <el-icon class="stat-icon"><FolderOpened /></el-icon>
        <div>
          <h3>分类总数</h3>
          <p>{{ totalCategories }}</p>
        </div>
      </div>
    </el-card>

    <!-- 分类列表 -->
    <el-card>
      <template #header>
        <div class="table-header">
          <span>分类列表</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索分类..."
            clearable
            style="width: 300px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </template>

      <el-empty v-if="isEmpty" description="暂无分类数据" />

      <div v-else class="category-list">
        <transition-group name="fade-list">
          <div
            v-for="category in filteredCategories"
            :key="category.id"
            class="category-item"
          >
            <span class="name">{{ category.name }}</span>
            <div class="actions">
              <el-button
                type="primary"
                size="small"
                @click="handleEdit(category)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(category)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </transition-group>
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑分类' : '新建分类'"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="分类名称" required>
          <el-input
            v-model="form.name"
            placeholder="请输入分类名称"
            clearable
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">
          {{ isEditing ? "更新" : "创建" }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useCategoryStore } from "../../../stores/category";
import { addOperationLog } from "../../../utils/operationLog";

const categoryStore = useCategoryStore();

// 响应式数据
const searchKeyword = ref("");
const dialogVisible = ref(false);
const isEditing = ref(false);
const form = ref({
  id: "",
  name: "",
});

// 计算属性
const totalCategories = computed(() => categoryStore.categories.length);
const isEmpty = computed(() => categoryStore.categories.length === 0);
const filteredCategories = computed(() => {
  const keyword = searchKeyword.value.toLowerCase();
  return categoryStore.categories.filter((c) =>
    c.name.toLowerCase().includes(keyword)
  );
});

// 生命周期
onMounted(async () => {
  await categoryStore.fetchCategories();
});

// 页面激活时刷新数据
onActivated(async () => {
  await categoryStore.fetchCategories();
});

// 操作方法
const handleAdd = () => {
  isEditing.value = false;
  form.value = { id: "", name: "" };
  dialogVisible.value = true;
};

const handleEdit = (category) => {
  isEditing.value = true;
  form.value = { ...category };
  dialogVisible.value = true;
};

const handleDelete = async (category) => {
  try {
    await ElMessageBox.confirm(
      `确定删除分类 "${category.name}" 吗？此操作不可恢复！`,
      "删除确认",
      {
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await categoryStore.deleteCategory(category.id);
    ElMessage.success("分类删除成功");
    await addOperationLog(`删除了分类：${category.name}`);
  } catch (error) {
    ElMessage.info("取消删除操作");
  }
};

const submitForm = async () => {
  if (!form.value.name.trim()) {
    return ElMessage.warning("分类名称不能为空");
  }

  try {
    if (isEditing.value) {
      await categoryStore.updateCategory(form.value);
      ElMessage.success("分类更新成功");
      await addOperationLog(`更新了分类：${form.value.name}`);
    } else {
      await categoryStore.addCategory(form.value);
      ElMessage.success("分类创建成功");
      await addOperationLog(`添加了分类：${form.value.name}`);
    }
    dialogVisible.value = false;
  } catch (error) {
    ElMessage.error(`操作失败: ${error.message}`);
  }
};
</script>

<style lang="scss" scoped>
.category-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

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

  .stat-card {
    margin-bottom: 20px;

    .stat-content {
      display: flex;
      align-items: center;
      gap: 20px;

      .stat-icon {
        font-size: 40px;
        color: var(--el-color-primary);
      }

      h3 {
        margin: 0;
        color: var(--el-text-color-regular);
        font-weight: normal;
      }

      p {
        margin: 0;
        font-size: 24px;
        font-weight: bold;
      }
    }
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .category-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }

  .category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-radius: 4px;
    background-color: var(--el-color-primary-light-9);
    transition: all 0.3s;

    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--el-box-shadow-light);
    }

    .name {
      font-weight: 500;
      color: var(--el-text-color-primary);
    }

    .actions {
      display: flex;
      gap: 8px;
    }
  }
}

.fade-list-move,
.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.3s ease;
}

.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-list-leave-active {
  position: absolute;
}
</style>
