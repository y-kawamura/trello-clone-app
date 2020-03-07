<template>
  <v-app>
    <v-app-bar
      app
      color="red lighten-1"
      dark
    >
      <v-toolbar-title class="font-italic font-weight-light px-1">
        Trello Clone
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-avatar color="white" size="32">
        <img
          src="@/assets/avatar.png"
          alt="User image"
        >
      </v-avatar>
      <strong class="mx-2 font-weight-light">
        {{ user.displayName }}
      </strong>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <h1>This is boards page</h1>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Boards',
  computed: {
    ...mapGetters('auth', ['user']),
  },
};
</script>
