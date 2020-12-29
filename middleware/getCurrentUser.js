import { getCurrentUser } from '@/api/user'
const Cookie = process.client ? require("js-cookie") : undefined;

export default async function ({ store }) {
  if (store.state.user) {
    const { data } = await getCurrentUser();
    const { user } = data

    if (JSON.stringify(user) !== JSON.stringify(store.state.user)) {
      store.commit('setUser', user)
    }

    if (Cookie) {
      const userCookie = Cookie.getJSON("user")
      if (JSON.stringify(user) !== JSON.stringify(userCookie)) {
        Cookie.remove("user");
        //更新cookie，更新state
        Cookie.set("user", user);
      }
    }
  }
}