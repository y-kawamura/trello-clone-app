/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  draggingCard: null,
  droppingList: null,
};

const mutations = {
  setDraggingCard(state, card) {
    state.draggingCard = card;
  },
  setDroppingList(state, list) {
    state.droppingList = list;
  },
};

const actions = {
  setDraggingCard({ commit }, card) {
    commit('setDraggingCard', card);
  },
  setDroppingList({ commit }, list) {
    commit('setDroppingList', list);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
