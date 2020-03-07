<template>
  <div class="container">
    <h1 class="font-weight-thin display-3 mt-12 text-center">
      Trello Clone
    </h1>
    <p class="font-weight-thin display-1 my-4 text-center">
      Vue - Feathers <span class="indigo--text text--lighten-1">.js</span>
    </p>
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
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>
