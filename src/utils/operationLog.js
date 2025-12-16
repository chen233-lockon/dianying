import { operationLogAPI } from "@/api/index.js";

// 添加操作日志的通用函数
export const addOperationLog = async (action) => {
  try {
    const time = new Date()
      .toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/\//g, "-");

    // 使用operationLogAPI创建操作日志
    await operationLogAPI.createLog({
      action,
      time,
    });
  } catch (error) {
    console.error("记录操作日志失败:", error);
  }
};
