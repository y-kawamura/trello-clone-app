<template>
  <v-app>
    <!-- navigation drawer -->
    <v-navigation-drawer
      v-model="drawer"
      right
      temporary
      app
    >
      <v-list nav>
        <v-list-item link>
          <v-list-item-content>
            <div class="avatar" @click="drawer = !drawer">
              <v-avatar color="white" size="32">
                <img
                  src="@/assets/avatar.png"
                  alt="User image"
                >
              </v-avatar>
              <strong class="mx-2 font-weight-light">
                {{ user.displayName }} @{{ user.username }}
              </strong>
            </div>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item link @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="red lighten-1"
      dark
    >
      <v-toolbar-title class="font-italic font-weight-light px-1">
        Trello Clone
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="avatar" @click="drawer = !drawer">
        <v-avatar color="white" size="32">
          <img
            src="@/assets/avatar.png"
            alt="User image"
          >
        </v-avatar>
        <strong class="mx-2 font-weight-light">
          {{ user.displayName }}
        </strong>
      </div>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <h1>This is boards page</h1>
      </v-container>
    </v-content>
  </v-app>
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

<style scoped>
.avatar {
  cursor: pointer;
}
</style>
