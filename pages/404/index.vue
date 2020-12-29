<template>
  <div class="container page">
    <h1>404</h1>
    <button @click="onClick">返回首页</button>
  </div>
</template>

<script>
export default {
  name: "ErrorPage",
  methods: {
    onClick() {
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>