// 添加操作日志的通用函数（使用本地存储）
export const addOperationLog = async (action) => {
  try {
    // 获取当前用户名
    const username = localStorage.getItem("username") || "管理员";

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

    // 构造日志数据
    const logData = {
      id: `op_${Date.now()}`,
      username,
      action,
      time,
    };

    // 使用localStorage存储操作日志
    const localLogs = localStorage.getItem("operationLogs");
    const logs = localLogs ? JSON.parse(localLogs) : [];

    // 添加新日志到开头
    logs.unshift(logData);

    // 只保留最近100条日志
    if (logs.length > 100) {
      logs.splice(100);
    }

    localStorage.setItem("operationLogs", JSON.stringify(logs));
    console.log("操作日志已记录:", logData);
  } catch (error) {
    console.error("记录操作日志失败:", error);
    // 即使日志记录失败，也不影响主要操作
  }
};
