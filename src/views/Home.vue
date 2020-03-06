<template>
  <div class="container">
    <h1 class="font-weight-thin display-3 my-12 text-center">Trello Clone</h1>
    <v-btn
      :to="{ name: 'Login' }"
      class="my-6 mx-auto d-flex"
      outlined
      color="indigo"
      max-width="350px"
    >
      Login
    </v-btn>
    <v-btn
      :to="{ name: 'SignUp' }"
      class="my-6 mx-auto d-flex"
      color="indigo darken-1"
      dark
      max-width="350px"
    >
      Sign Up
    </v-btn>

    <!-- loading -->
    <v-overlay v-if="isLoading" opacity="0.3">
      <v-progress-circular
        :size="70"
        color="indigo accent-4"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Home',
  computed: {
    ...mapState('auth', { isLoading: 'isAuthenticatePending' }),
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
  },
  mounted() {
    this.authenticate()
      .then(() => {
        this.$router.push('/boards');
      })
      .catch(() => {
        // user is not logged in
      });
  },
};
</script>
