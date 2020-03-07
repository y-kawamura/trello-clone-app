<template>
  <v-app>
    <router-view/>

    <!-- loading -->
    <loading />

    <v-footer fixed="fixed" app>
      <span>&copy; 2020 - Made by penta</span>
    </v-footer>
  </v-app>
</template>

<script>
import Loading from '@/components/Loading.vue';

export default {
  name: 'App',
  components: {
    Loading,
  },

  data: () => ({
    //
  }),
};
</script>
