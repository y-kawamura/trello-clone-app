<template>
  <div>
    <!-- navigation drawer -->
    <v-navigation-drawer
      v-model="drawer"
      right
      temporary
      app
    >
      <v-list nav>
        <v-list-item link @click="drawer = !drawer">
          <v-list-item-content>
            <div class="avatar">
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
      :color="color"
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
  </div>
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

<style scoped>
.avatar {
  cursor: pointer;
}
</style>
