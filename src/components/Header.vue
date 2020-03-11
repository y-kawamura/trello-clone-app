<template>
  <v-app-bar :color="color" app dark>
    <v-toolbar-title class="font-italic font-weight-light pr-1">Trello Clone</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-menu offset-y transition="slide-x-reverse-transition">
        <template v-slot:activator="{on}">
          <v-btn v-on="on" text class="text-none pa-0">
            <v-avatar color="white" size="32" class="mx-2">
              <img
                src="@/assets/avatar.png"
                alt="User image"
              >
            </v-avatar>
            <span class="font-weight-light">
              {{ user.displayName }}
            </span>
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list width="150" elevation="20" class="mt-2">
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item link @click="logout">
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Boards',
  data() {
    return {
      drawer: false,
    };
  },
  props: {
    color: {
      type: String,
      default: 'indigo',
    },
  },
  computed: {
    ...mapGetters('auth', ['user']),
  },
  methods: {
    ...mapActions('auth', { authLogout: 'logout' }),
    logout() {
      this.authLogout()
        .then(() => {
          this.$router.push('/login');
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
