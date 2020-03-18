/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  draggingCard: null,
  droppingList: null,
  board: null,
};

const getters = {
  bgColor: (state) => (type) => (type ? `${state.board.background} ${type}` : `${state.board.background}`),
  textColor: (state) => (type) => (type ? `${state.board.background}--text text--${type}` : `${state.board.background}--text`),
};

const mutations = {
  setDraggingCard(state, card) {
    state.draggingCard = card;
  },
  setDroppingList(state, list) {
    state.droppingList = list;
  },
  setBoard(state, board) {
    state.board = board;
  },
};

const actions = {
  setDraggingCard({ commit }, card) {
    commit('setDraggingCard', card);
  },
  setDroppingList({ commit }, list) {
    commit('setDroppingList', list);
  },
  setBoard({ commit }, board) {
    commit('setBoard', board);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
