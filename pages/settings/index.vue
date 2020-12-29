<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <ul class="error-messages">
            <template v-for="(messages, filed) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ filed }}{{ message }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="user.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="user.username"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="user.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  v-model="user.email"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="user.password"
                  required
                  minlength="8"
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                :disabled="disabled"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="onLogout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { editCurrentUser } from "@/api/user";
import { is_img_url } from "@/utils/utils";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  //在路由匹配组件渲染之前会先执行中间件处理
  middleware: ["getCurrentUser", "authenticated"],
  name: "SettingIndex",
  data() {
    return {
      user: {},
      disabled: false,
      errors: {},
    };
  },
  methods: {
    async onSubmit() {
      this.disabled = true;
      this.errors = {};
      const postData = { ...this.user };
      if (is_img_url(postData.image)) {
        const { data } = await editCurrentUser({ user: postData });
        //跳转到首页
        this.$router.push("/");
      } else {
        this.disabled = false;
        this.errors = { "Error: ": ["Image format error"] };
      }
    },
    onLogout() {
      this.$store.commit("setUser", null);
      const user = Cookie.get("user");
      if (user) {
        Cookie.remove("user");
      }
      this.$router.push("/");
    },
  },
  created() {
    this.user = { ...this.$store.state.user };
  },
};
</script>

<style>
</style>