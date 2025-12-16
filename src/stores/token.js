import { defineStore } from "pinia";
import { ref } from "vue";

const useToken = defineStore(
  "token",
  () => {
    const token = ref(null);
    const updateToken = (val) => {
      token.value = val;
      localStorage.setItem("token", val);
    };
    const removeToken = () => {
      token.value = null;
      localStorage.removeItem("token");
    };
    return { token, updateToken, removeToken };
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: "token",
          storage: localStorage,
        },
      ],
    },
  }
);
export default useToken;
