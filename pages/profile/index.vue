<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="user.image" class="user-img" />
            <h4>{{ user.username }}</h4>
            <p>
              {{ user.bio }}
            </p>
            <button
              v-if="!isCurrentUser"
              class="btn btn-sm btn-outline-secondary action-btn"
              :class="{
                active: user.following,
              }"
              @click="onFollow(user)"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ user.following ? "unFollow" : "Follow" }}
              {{ user.username }}
            </button>
            <button
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="onEdit"
            >
              <i class="ion-gear-a"></i>
              &nbsp; Edit Profile Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'my',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'my',
                    },
                  }"
                >
                  {{ isCurrentUser ? "My" : user.username }} Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'favorited',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favorited',
                    },
                  }"
                >
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>

          <template v-if="articles && articles.length > 0">
            <div
              class="article-preview"
              v-for="article in articles"
              :key="article.slug"
            >
              <article-item :article="article" />
            </div>
          </template>
          <template v-else>
            <div class="article-preview">No articles are here... yet.</div>
          </template>
          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{
                  active: item === page,
                }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag: $route.query.tag,
                      tab: tab,
                    },
                  }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
          <!-- /分页列表 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/profile";
import { getArticles } from "@/api/article";
import ArticleItem from "@/components/article-item";
import { followUser, unFollowUser } from "@/api/profile";
export default {
  //在路由匹配组件渲染之前会先执行中间件处理
  middleware: ["getCurrentUser", "authenticated"],
  name: "UserProfile",
  data() {
    return {
      user: {
        image: "",
        bio: "",
        username: "",
        following: false,
      },
      followDisabled: false,
    };
  },
  async asyncData({ query, store, params }) {
    let page = Number.parseInt(query.page || 1);
    const limit = 20;
    const { tab = "my" } = query;
    const queryParams = {
      limit,
      offset: (page - 1) * limit,
    };
    if (tab === "my") {
      queryParams["author"] = params.username;
    } else {
      queryParams["favorited"] = params.username;
    }

    let isCurrentUser = store.state.user.username === params.username;
    //优化并行异步任务
    const [articleRes, profileRes] = await Promise.all([
      getArticles(queryParams),
      getUserProfile(params.username),
    ]);
    const { articles, articlesCount } = articleRes.data;
    const { profile } = profileRes.data;
    articles.forEach((article) => (article.favoriteDisabled = false));
    return {
      articles,
      articlesCount,
      limit,
      page,
      user: profile,
      tab,
      isCurrentUser,
    };
  },
  components: {
    ArticleItem,
  },
  watchQuery: ["page", "tab"],
  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    //关注
    async onFollow(user) {
      this.followDisabled = true;
      if (user.following) {
        //取消关注
        await unFollowUser(user.username);
        user.following = false;
      } else {
        //添加关注
        await followUser(user.username);
        user.following = true;
      }
      this.followDisabled = false;
    },
    onEdit() {
      this.$router.push({
        name: "settings",
      });
    },
  },
};
</script>

<style>
</style>