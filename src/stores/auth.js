import { defineStore } from "pinia";
import { userAPI } from "@/api/index.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  }),

  actions: {
    // 设置用户信息并持久化
    setUser(user) {
      this.user = user;
      this.persistAuthData();
    },

    // 设置登录状态并持久化
    setIsLoggedIn(status) {
      this.isLoggedIn = status;
      this.persistAuthData();
    },

    // 登出并清理
    logout() {
      this.user = null;
      this.isLoggedIn = false;
      this.clearAuthData();
    },

    // 登录方法
    async login(credentials) {
      try {
        const { data: users } = await userAPI.getUsers();
        const user = users.find(
          (u) =>
            u.account === credentials.account &&
            u.password === credentials.password
        );

        if (!user) {
          return { success: false, message: "用户名或密码错误" };
        }

        this.setUser(user);
        this.setIsLoggedIn(true);
        return { success: true, user };
      } catch (error) {
        console.error("登录失败:", error);
        return {
          success: false,
          message: error.response?.data?.message || "登录失败",
        };
      }
    },

    // 刷新用户信息
    async refreshUser() {
      if (!this.user?.id) return;

      try {
        const { data } = await userAPI.getUser(this.user.id);
        this.setUser(data);
        return data;
      } catch (error) {
        console.error("刷新用户信息失败:", error);
      }
    },

    // 私有方法 - 持久化认证数据
    persistAuthData() {
      if (this.user) {
        localStorage.setItem("user", JSON.stringify(this.user));
      }
      localStorage.setItem("isLoggedIn", this.isLoggedIn.toString());
    },

    // 私有方法 - 清理认证数据
    clearAuthData() {
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
    },
  },
});
