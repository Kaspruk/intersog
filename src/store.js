import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store =  new Vuex.Store({
  state: {
    currentCompany: null
  },
  getters: {
    CURRENT_COMPANY: state => state.currentCompany,
  },
  mutations: {
    SET_CURRENT_COMPANY: (state, payload) => {
      state.currentCompany = payload;
    },
  },
  actions: {

  }
});
