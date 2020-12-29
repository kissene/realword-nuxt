<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  v-model="viwData.title"
                  required
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="viwData.description"
                  required
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  required
                  v-model="viwData.body"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="viwData.tagStr"
                />
                <div class="tag-list">
                  <template v-for="(item, index) in viwData.tagList">
                    <span
                      class="tag-default tag-pill"
                      @click="onDeleteTag(item)"
                    >
                      <i class="ion-close-round"></i>
                      {{ item }}
                    </span>
                  </template>
                </div>
              </fieldset>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary">
              Publish Article
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticle, updateArticle, getArticle } from "@/api/article";
import { splitStr } from "@/utils/utils";
export default {
  //在路由匹配组件渲染之前会先执行中间件处理
  middleware: "authenticated",
  name: "EditorIndex",
  data() {
    return {
      disabled: false,
      viwData: {
        title: "",
        description: "",
        body: "",
        tagStr: "",
        tagList: [],
      },
      errors: {}, //错误信息
    };
  },
  methods: {
    async onSubmit() {
      this.disabled = true;
      let api = "createArticle";
      const postData = { ...this.viwData };
      if (postData.tagStr !== "") {
        postData["tagList"] = splitStr(postData.tagStr);
      }
      if (this.$route.params.slug) {
        //更新
        api = updateArticle;
      } else {
        //新增
        api = createArticle;
      }

      const { data } = await api(this.$route.params.slug, {
        article: postData,
      });
      this.$router.push({
        name: "article",
        params: {
          slug: data.article.slug,
        },
      });
    },
    onDeleteTag(item) {
      const index = this.viwData.tagList.findIndex((value, index, arr) => {
        return value === item;
      });
      this.viwData.tagList.splice(index, 1);
    },
  },
  async beforeRouteEnter(to, from, next) {
    if (to.params.slug !== undefined) {
      const { data } = await getArticle(to.params.slug);
      const { article } = data;
      next((vm) => {
        vm.viwData["title"] = article["title"];
        vm.viwData["description"] = article["description"];
        vm.viwData["body"] = article["body"];
        vm.viwData["tagStr"] = "";
        vm.viwData["tagList"] = article["tagList"];
      });
    } else {
      next();
    }
  },
  async mounted() {},
};
</script>

<style>
</style>