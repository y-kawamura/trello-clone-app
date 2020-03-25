<template>
  <v-app-bar :color="color" app dark>
    <v-toolbar-title>
      <router-link
        :to="{name: 'Home'}"
      >Trello Clone</router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items v-if="currentUser">
      <v-menu offset-y transition="slide-x-reverse-transition">
        <template v-slot:activator="{on}">
          <v-btn v-on="on" text :ripple="false" :hover="false" class="text-none pa-0">
            <v-avatar color="white" size="32" class="mx-2">
              <img
                :src="userImage"
                alt="User image"
              >
            </v-avatar>
            <span class="font-weight-light">
              {{ currentUser.displayName }}
            </span>
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list width="150" elevation="20" class="mt-2">
          <v-list-item link :to="{name: 'UserEdit'}">
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
import { mapState, mapGetters, mapActions } from 'vuex';
import anonymousAvatar from '@/assets/avatar.png';

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
      default: 'grey',
    },
  },
  computed: {
    ...mapState(['currentUser']),
    ...mapGetters('auth', ['user']),
    userImage() {
      return this.currentUser.imageUrl || anonymousAvatar;
    },
  },
  methods: {
    ...mapActions(['setCurrentUser']),
    ...mapActions('auth', { authLogout: 'logout' }),
    logout() {
      this.authLogout()
        .then(() => {
          this.setCurrentUser(null);
          this.$router.push('/login');
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  created() {
    if (!this.currentUser) {
      const user = {
        _id: this.user._id,
        username: this.user.username,
        displayName: this.user.displayName,
        imageUrl: this.user.imageUrl,
      };
      this.setCurrentUser(user);
    }
  },
};
</script>

<style scoped>
.router-link-active {
  color: white;
  text-decoration: none;
  font-family: 'Yellowtail', cursive;
  font-size: 1.5rem;
}
.v-btn:before {
  display: none;
}
</style>
