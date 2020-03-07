<template>
  <v-app>
    <router-view/>
    <v-footer fixed="fixed" app>
      <span>&copy; 2020 - Made by penta</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
