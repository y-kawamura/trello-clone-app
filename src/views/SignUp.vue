<template>
  <v-row align="center" justify="center" style="height: 100%;">
    <v-card max-width="400px" width="100%" class="ma-10">
      <v-card-title>
        <h1 class="display-1 font-weight-thin">Sign Up</h1>
      </v-card-title>
      <v-card-text>
        <v-form
          @submit.prevent="onSubmit()"
          v-model="valid"
          ref="form"
          lazy-validation
        >
          <v-text-field
            v-model="user.username"
            label="User Name"
            color="indigo darken-1"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.displayNmae"
            label="Display Name"
            color="indigo darken-1"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.imageUrl"
            label="User Image"
            color="indigo darken-1"
          ></v-text-field>

          <v-text-field
            v-model="user.password"
            type="password"
            label="Password"
            color="indigo darken-1"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.confirmPassword"
            type="password"
            label="Confitm Password"
            color="indigo darken-1"
            required
          ></v-text-field>

          <v-btn
            class="my-4"
            color="indigo darken-1"
            dark
            @click="onSubmit"
          >
            Sign Up
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: 'SignUp',
  data() {
    return {
      valid: true,
      user: {
        username: '',
        displayName: '',
        imageUrl: '',
        password: '',
        confirmPassword: '',
      },
    };
  },
  methods: {
    onSubmit() {
      console.log(this.user);
    },
  },
};
</script>
