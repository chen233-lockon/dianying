import { RouterView, createRouter, createWebHashHistory } from "vue-router";
import { h } from "vue";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/home/homepage" },
    {
      path: "/login",
      name: "login",
      component: () => import("../components/backend/Login.vue"),
    },
    {
      path: "/index",
      name: "index",
      component: () => import("../components/backend/Index.vue"),
      redirect: "/backendhome",
      children: [
        {
          path: "/backendhome",
          name: "backendhome",
          component: () => import("../components/backend/pages/Index.vue"),
          meta: { title: "首页" },
        },
        {
          path: "/category",
          name: "category",
          component: () => import("../components/backend/pages/Category.vue"),
          meta: { title: "分类管理" },
        },
        {
          path: "/goods",
          name: "goods",
          component: () => import("../components/backend/pages/Goods.vue"),
          meta: { title: "电影管理" },
        },
        {
          path: "/users",
          name: "users",
          component: () => import("../components/backend/pages/Users.vue"),
          meta: { title: "用户管理" },
        },
        {
          path: "/announcements",
          name: "announcements",
          component: () =>
            import("../components/backend/pages/Announcements.vue"),
          meta: { title: "公告管理" },
        },
        {
          path: "/setting",
          name: "setting",
          component: () => import("../components/backend/pages/Setting.vue"),
          meta: { title: "个人中心" },
        },
      ],
    },
    {
      path: "/qianlogin",
      component: () => import("../components/subcomponents/qianlogin.vue"),
    },
    {
      path: "/register",
      component: () => import("../components/subcomponents/register.vue"),
    },

    {
      path: "/home",
      component: () => import("../components/Home.vue"),
      redirect: "/home/homepage",
      children: [
        {
          path: "database",
          component: { render: () => h(RouterView) },
          children: [
            {
              path: "",
              component: () =>
                import("../components/subcomponents/DataBase.vue"),
            },
            {
              path: "detail/:id",
              name: "details",
              component: () => import("../components/user/MyUserDetail.vue"),
              props: true,
            },
          ],
        },
        {
          path: "homepage",
          component: () => import("../components/subcomponents/HomePage.vue"),
        },
        {
          path: "movies",
          component: () => import("../components/subcomponents/Movies.vue"),
        },
        {
          path: "person",
          component: () => import("../components/subcomponents/UserCenter.vue"),
        },
        {
          path: "communication",
          component: () =>
            import("../components/subcomponents/Communication.vue"),
        },
      ],
    },
  ],
});

export default router;
