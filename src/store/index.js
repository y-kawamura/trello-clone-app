import Vue from 'vue';
import Vuex from 'vuex';
import { FeathersVuex } from '../feathers-client';
import auth from './store.auth';
import board from './board';

Vue.use(Vuex);
Vue.use(FeathersVuex);

const requireModule = require.context(
  // The path where the service modules live
  './services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/,
);
const servicePlugins = requireModule
  .keys()
  .map((modulePath) => requireModule(modulePath).default);

export default new Vuex.Store({
  state: {
    currentUser: null,
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
  },
  actions: {
    setCurrentUser({ commit }, user) {
      commit('setCurrentUser', user);
    },
  },
  modules: {
    board,
  },
  plugins: [...servicePlugins, auth],
});
