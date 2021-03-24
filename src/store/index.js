import Vue from 'vue'
import Vuex from 'vuex'

import bookmarks from "@/store/modules/bookmarks";
import auth from "@/store/modules/auth"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    bookmarks: bookmarks,
    auth: auth
  }
})
