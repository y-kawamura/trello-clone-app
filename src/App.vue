<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
    <v-footer fixed="fixed" app>
      <span>&copy; 2020 - Made by penta🝧</span>
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
