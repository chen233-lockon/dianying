import { defineStore } from "pinia";
import { movieAPI } from "../api/index";
import { ElMessage } from "element-plus";
import { addOperationLog } from "../utils/operationLog";

export const useMovieStore = defineStore("movie", {
  state: () => ({
    movies: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
    },
    currentMovie: null, // 当前编辑的电影
  }),
  actions: {
    async fetchMovies() {
      try {
        const { list, total } = await movieAPI.getMovies({
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
        });

        //处理空数据时重置页码
        if (list.length === 0 && this.pagination.page > 1) {
          this.pagination.page--;
          return this.fetchMovies();
        }

        this.movies = list;
        this.pagination.total = total;
      } catch (error) {
        console.error("获取数据失败:", error);
        ElMessage.error("获取电影数据失败");
      }
    },
    async createMovie(movieData) {
      await movieAPI.createMovie(movieData);
      await this.fetchMovies();
      await addOperationLog(`添加了电影：${movieData.name}`);
    },

    async updateMovie(id, movieData) {
      await movieAPI.updateMovie(id, movieData);
      await this.fetchMovies();
      await addOperationLog(`修改了电影：${movieData.name}`);
    },

    async deleteMovie(id) {
      await movieAPI.deleteMovie(id);
      await this.fetchMovies();
      await addOperationLog(`删除了电影：${movieData.name}`);
    },

    setCurrentMovie(movie) {
      this.currentMovie = movie;
    },
  },
});
