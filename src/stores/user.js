import { defineStore } from "pinia";
import axios from "axios";
import { adminAPI } from "@/api/index.js";

export const useUserStore = defineStore("user", {
  state: () => ({
    loginInfo: {
      loginTime: null,
      loginPlace: null,
      mounth: null,
    },
    adminProfile: {
      id: null,
      username: null,
      avatar: null,
      email: null,
      phone: null,
      registerDate: null,
    },
    isAuthenticated: false,
  }),
  actions: {
    async fetchLocation() {
      try {
        const position = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            maximumAge: 300000,
            enableHighAccuracy: false,
          })
        );

        const { data } = await axios.get(
          "https://api.bigdatacloud.net/data/reverse-geocode-client",
          {
            params: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              localityLanguage: "zh",
            },
            timeout: 5000,
          }
        );
        return (
          data.city ||
          data.locality ||
          data.principalSubdivision ||
          data.countryName ||
          "未知地区"
        );
      } catch (error) {
        try {
          const { data } = await axios.get("https://ipapi.co/json/", {
            timeout: 4000,
          });
          return data.city || data.region || data.country_name || "未知地区";
        } catch (e) {
          console.error("定位失败:", error);
          return "未知地区";
        }
      }
    },

    async setLoginInfo() {
      const now = new Date();
      this.loginInfo = {
        loginTime: now
          .toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(/\//g, "-"),
        loginPlace: "定位中...", // 初始值
        mounth: now.toLocaleDateString("zh-CN", { month: "numeric" }),
      };
      // 异步获取定位（不阻塞登录）
      this.fetchLocation()
        .then((location) => {
          this.loginInfo.loginPlace = location;
        })
        .catch(() => {
          this.loginInfo.loginPlace = "定位失败";
        });

      // 设置用户信息（实际项目应从接口获取）
      this.userProfile = {
        username: "admin",
        avatar:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      };
    },
    setAdminProfile(admin) {
      this.adminProfile = {
        id: admin.id,
        username: admin.username,
        avatar: admin.avatar + `?t=${Date.now()}`, // 添加时间戳避免缓存
        email: admin.email,
        phone: admin.phone,
        registerDate: admin.registerDate,
      };
      this.isAuthenticated = true;
      localStorage.setItem("token", "Bearer xxx");
    },

    async loadAdminProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("未登录");

        // 调用API获取管理员信息
        const response = await adminAPI.getAdmins();
        if (response.data.length > 0) {
          this.setAdminProfile(response.data[0]);
        } else {
          throw new Error("管理员信息不存在");
        }
      } catch (error) {
        console.error("加载管理员信息失败:", error);
        throw error;
      }
    },

    clearLoginInfo() {
      this.loginInfo = {
        loginTime: null,
        loginPlace: null,
        month: null,
      };
      this.adminProfile = {
        id: null,
        username: null,
        avatar: null,
        email: null,
        phone: null,
        registerDate: null,
      };
      this.isAuthenticated = false;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "user",
        storage: localStorage,
        paths: ["loginInfo", "adminProfile", "isAuthenticated"],
      },
    ],
  },
});
