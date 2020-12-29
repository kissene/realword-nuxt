<template>
  <div class="article-meta">
    <!-- 用户头像 -->
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
    >
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <!-- 用户名及日期 -->
      <nuxt-link
        class="author"
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
      >
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date("MMM DD YYYY") }}</span>
    </div>
    <!-- 其他用户的文章 -->
    <template v-if="user.username !== article.author.username">
      <!-- 关注按钮 -->
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following,
        }"
        :disabled="followDisabled"
        @click="onFollow(article)"
      >
        <i class="ion-plus-round"></i>
        &nbsp; Follow {{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <!-- 点赞按钮 -->
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited,
        }"
        :disabled="favoriteDisabled"
        @click="onFavorite(article)"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
    <!-- 自己的文章 -->
    <template v-else>
      <!-- 编辑文章按钮 -->
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following,
        }"
        :disabled="editDisabled"
        @click="editArticle(article)"
      >
        <i class="ion-edit"></i>
        &nbsp; Edit Article
      </button>
      &nbsp;&nbsp;
      <!-- 删除文章按钮 -->
      <button
        class="btn btn-outline-danger btn-sm"
        :class="{
          active: article.favorited,
        }"
        :disabled="deleteDisabled"
        @click="deleteArticle(article)"
      >
        <i class="ion-trash-a"></i>
        &nbsp; Delete Article
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  addFavorite,
  deleteFavorite,
  updateArticle,
  deleteArticle,
} from "@/api/article";
import { followUser, unFollowUser } from "@/api/profile";
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      followDisabled: false,
      favoriteDisabled: false,
      editDisabled: false,
      deleteDisabled: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    //关注
    async onFollow(article) {
      this.followDisabled = true;
      if (article.author.following) {
        //取消关注
        await unFollowUser(article.author.username);
        article.author.following = false;
      } else {
        //添加关注
        await followUser(article.author.username);
        article.author.following = true;
      }
      this.followDisabled = false;
    },
    //点赞
    async onFavorite(article) {
      this.favoriteDisabled = true;
      if (article.favorited) {
        //取消点赞
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount -= 1;
      } else {
        //添加点赞
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      this.favoriteDisabled = false;
    },
    //修改文章
    async editArticle(article) {
      this.$router.push({
        name: "editor",
        params: {
          slug: article.slug,
        },
      });
    },
    async deleteArticle(article) {
      const res = confirm("Delete ?");
      if (res == true) {
        await deleteArticle(article.slug);
        this.$router.push("/");
      }
    },
  },
};
</script>

<style>
</style>