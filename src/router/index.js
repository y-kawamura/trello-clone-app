import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '@/store';

import Home from '../views/Home.vue';

Vue.use(VueRouter);

const checkLogin = (next) => {
  if (store.getters['auth/isAuthenticated']) {
    next();
  }
  store.dispatch('auth/authenticate')
    .then(() => {
      next();
    })
    .catch(() => {
      next(('/login'));
    });
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter(to, from, next) {
      store.dispatch('auth/authenticate')
        .then(() => {
          next('/boards');
        })
        .catch(() => {
          next();
        });
    },
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../views/SignUp.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/boards',
    name: 'Boards',
    component: () => import('../views/Boards.vue'),
    beforeEnter(to, from, next) {
      checkLogin(next);
    },
  },
  {
    path: '/boards/:board_id',
    name: 'Board',
    component: () => import('../views/Board.vue'),
    beforeEnter(to, from, next) {
      checkLogin(next);
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
