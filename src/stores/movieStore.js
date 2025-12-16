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
      try {
        await movieAPI.createMovie(movieData);
        await this.fetchMovies();
        await addOperationLog(`添加了电影：${movieData.name}`);
      } catch (error) {
        console.error("创建电影失败:", error);
        ElMessage.error("创建电影失败: " + error.message);
        throw error;
      }
    },

    async updateMovie(id, movieData) {
      try {
        await movieAPI.updateMovie(id, movieData);
        await this.fetchMovies();
        await addOperationLog(`修改了电影：${movieData.name}`);
      } catch (error) {
        console.error("更新电影失败:", error);
        ElMessage.error("更新电影失败: " + error.message);
        throw error;
      }
    },

    async deleteMovie(id) {
      try {
        const movie = this.movies.find((m) => m.id === id);
        const movieName = movie ? movie.name : "Unknown";
        await movieAPI.deleteMovie(id);
        await this.fetchMovies();
        await addOperationLog(`删除了电影：${movieName}`);
      } catch (error) {
        console.error("删除电影失败:", error);
        ElMessage.error("删除电影失败: " + error.message);
        throw error;
      }
    },

    setCurrentMovie(movie) {
      this.currentMovie = movie;
    },
  },
});
