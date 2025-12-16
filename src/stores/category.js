import { defineStore } from "pinia";
import { categoryAPI } from "../api/index";
import { ElMessage } from "element-plus";
import { addOperationLog } from "../utils/operationLog";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [],
  }),

  actions: {
    async fetchCategories() {
      try {
        const response = await categoryAPI.getCategories();
        this.categories = response.data;
      } catch (error) {
        ElMessage.error("获取分类失败: " + error.message);
        throw error;
      }
    },

    async addCategory(category) {
      try {
        await categoryAPI.createCategory(category);
        await addOperationLog(`添加了分类：${category.name}`);
        // 立即重新获取列表以更新界面
        await this.fetchCategories();
      } catch (error) {
        ElMessage.error("创建分类失败: " + error.message);
        throw error;
      }
    },

    async updateCategory(updatedCategory) {
      try {
        await categoryAPI.updateCategory(updatedCategory.id, updatedCategory);
        await addOperationLog(`修改了分类：${updatedCategory.name}`);
        // 立即重新获取列表以更新界面
        await this.fetchCategories();
      } catch (error) {
        ElMessage.error("更新分类失败: " + error.message);
        throw error;
      }
    },

    async deleteCategory(id) {
      try {
        const category = this.categories.find((c) => c.id === id);
        const categoryName = category ? category.name : "Unknown";
        await categoryAPI.deleteCategory(id);
        await addOperationLog(`删除了分类：${categoryName}`);
        // 立即重新获取列表以更新界面
        await this.fetchCategories();
      } catch (error) {
        ElMessage.error("删除分类失败: " + error.message);
        throw error;
      }
    },
  },
});
