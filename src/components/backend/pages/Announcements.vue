<template>
  <div class="announcements-management">
    <!-- 头部区域 -->
    <div class="header">
      <h1>
        <el-icon><Bell /></el-icon> 公告管理
      </h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon> 添加公告
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <el-card class="stat-card">
      <div class="stat-content">
        <el-icon class="stat-icon" style="color: #e6a23c"><Bell /></el-icon>
        <div>
          <h3>公告总数</h3>
          <p>{{ announcements.length }}</p>
        </div>
      </div>
    </el-card>

    <!-- 公告列表 -->
    <el-card>
      <template #header>
        <div class="table-header">
          <span>公告列表</span>
        </div>
      </template>

      <el-table :data="announcements" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" width="200" />
        <el-table-column prop="content" label="内容" show-overflow-tooltip />

        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)">
              {{ row.type || "通知" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="date" label="发布日期" width="180" />

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="warning" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑公告' : '新建公告'"
      width="600px"
    >
      <el-form :model="form" label-width="80px" ref="formRef" :rules="rules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题" />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入公告内容"
          />
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="选择公告类型">
            <el-option label="通知" value="通知" />
            <el-option label="公告" value="公告" />
            <el-option label="活动" value="活动" />
            <el-option label="维护" value="维护" />
          </el-select>
        </el-form-item>

        <el-form-item label="发布日期" prop="date">
          <el-date-picker
            v-model="form.date"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择日期时间"
            style="width: 100%"
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
import { ref, onMounted, onActivated } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { announcementAPI } from "../../../api/index";
import { addOperationLog } from "../../../utils/operationLog";

// 响应式数据
const announcements = ref([]);
const dialogVisible = ref(false);
const isEditing = ref(false);
const formRef = ref(null);

const form = ref({
  id: "",
  title: "",
  content: "",
  type: "通知",
  date: "",
});

const rules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
  type: [{ required: true, message: "请选择类型", trigger: "change" }],
};

// 生命周期
onMounted(async () => {
  await fetchAnnouncements();
});

// 页面激活时刷新数据
onActivated(async () => {
  await fetchAnnouncements();
});

// 获取公告列表
const fetchAnnouncements = async () => {
  try {
    const response = await announcementAPI.getAnnouncements();
    announcements.value = response.data;
  } catch (error) {
    ElMessage.error("获取公告列表失败");
  }
};

// 获取类型标签样式
const getTypeTag = (type) => {
  const tagMap = {
    通知: "info",
    公告: "success",
    活动: "warning",
    维护: "danger",
  };
  return tagMap[type] || "info";
};

// 操作方法
const handleAdd = () => {
  isEditing.value = false;
  form.value = {
    id: "",
    title: "",
    content: "",
    type: "通知",
    date: new Date().toISOString().slice(0, 19).replace("T", " "),
  };
  dialogVisible.value = true;
};

const handleEdit = (announcement) => {
  isEditing.value = true;
  form.value = { ...announcement };
  dialogVisible.value = true;
};

const handleDelete = async (announcement) => {
  try {
    await ElMessageBox.confirm(
      `确定删除公告 "${announcement.title}" 吗？此操作不可恢复！`,
      "删除确认",
      {
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await announcementAPI.deleteAnnouncement(announcement.id);
    await fetchAnnouncements();
    ElMessage.success("公告删除成功");
    await addOperationLog(`删除了公告：${announcement.title}`);
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

const submitForm = async () => {
  try {
    if (!formRef.value) {
      ElMessage.error("表单未初始化");
      return;
    }

    await formRef.value.validate();

    if (isEditing.value) {
      await announcementAPI.updateAnnouncement(form.value.id, form.value);
      await addOperationLog(`更新了公告：${form.value.title}`);
      ElMessage.success("公告更新成功");
    } else {
      await announcementAPI.createAnnouncement(form.value);
      await addOperationLog(`添加了公告：${form.value.title}`);
      ElMessage.success("公告创建成功");
    }

    dialogVisible.value = false;
    // 立即刷新列表
    await fetchAnnouncements();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("操作失败: " + (error.message || ""));
    }
  }
};
</script>

<style lang="scss" scoped>
.announcements-management {
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

  .stat-card {
    margin-bottom: 20px;

    .stat-content {
      display: flex;
      align-items: center;
      gap: 20px;

      .stat-icon {
        font-size: 40px;
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
}
</style>
