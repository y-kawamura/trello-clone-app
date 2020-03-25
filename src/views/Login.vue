<template>
  <v-row align="center" justify="center" style="height: 100%;">
    <v-card max-width="400px" width="100%" class="ma-10">
      <v-card-title>
        <h1 class="display-1 font-weight-thin my-2">Login</h1>
      </v-card-title>
      <v-card-text>
        <v-alert v-if="errors" type="error">
          {{ errors }}
        </v-alert>
      </v-card-text>
      <v-card-text>
        <v-form
          v-model="valid"
          ref="form"
          lazy-validation
        @submit.prevent="login"
        >
          <v-text-field
            v-model="user.username"
            :rules="emptyRules"
            label="User Name"
            color="indigo darken-1"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :rules="emptyRules"
            type="password"
            label="Password"
            color="indigo darken-1"
            required
          ></v-text-field>

          <v-btn
            type="submit"
            class="my-4"
            color="indigo darken-1"
            dark
          >
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      errors: '',
      valid: true,
      user: {
        username: '',
        password: '',
      },
      emptyRules: [
        (value) => !!value || 'Can not be empty',
      ],
    };
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    async login() {
      await this.$refs.form.validate();
      if (this.valid) {
        // login
        this.authenticate({
          strategy: 'local',
          ...this.user,
        })
          .then(() => {
            this.errors = '';
            this.$router.push('/boards');
          })
          .catch((error) => {
            this.errors = 'Username or Password is invaid!';
            console.log(error);
          });
      }
    },
  },
};
</script>
