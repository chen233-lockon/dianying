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
        const response = await categoryAPI.createCategory(category);
        this.categories.push(response.data);
        return response.data;
        await addOperationLog(`添加了分类：${category.name}`);
      } catch (error) {
        ElMessage.error("创建分类失败: " + error.message);
        throw error;
      }
    },

    async updateCategory(updatedCategory) {
      try {
        await categoryAPI.updateCategory(updatedCategory.id, updatedCategory);
        const index = this.categories.findIndex(
          (c) => c.id === updatedCategory.id
        );
        if (index !== -1) {
          this.categories.splice(index, 1, updatedCategory);
        }
        await addOperationLog(`修改了分类：${category.name}`);
      } catch (error) {
        ElMessage.error("更新分类失败: " + error.message);
        throw error;
      }
    },

    async deleteCategory(id) {
      try {
        await categoryAPI.deleteCategory(id);
        this.categories = this.categories.filter((c) => c.id !== id);
        await addOperationLog(`删除了分类：${category.name}`);
      } catch (error) {
        ElMessage.error("删除分类失败: " + error.message);
        throw error;
      }
    },
  },
});
