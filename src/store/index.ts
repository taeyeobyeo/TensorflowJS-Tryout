import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    block: 0
  },
  mutations: {
    // block(state) {
    //   state.block++;
    // },
    // unblock(state) {
    //   state.block = state.block - 1 >= 0 ? state.block - 1 : 0;
    // },
    // forceUnblock(state) {
    //   state.block = 0;
    // }
  },
  actions: {
  },
  modules: {
  }
})
