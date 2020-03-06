<template>
  <v-row align="center" justify="center" style="height: 100%;">
    <v-card max-width="400px" width="100%" class="ma-10">
      <v-card-title>
        <h1 class="display-1 font-weight-thin my-2">Sign Up</h1>
      </v-card-title>
      <v-card-text>
        <v-form
          v-model="valid"
          ref="form"
          lazy-validation
        >
          <v-text-field
            v-model="user.username"
            :rules="emptyRules"
            label="User Name"
            color="indigo darken-1"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.displayName"
            :rules="emptyRules"
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
            :rules="emptyRules"
            type="password"
            label="Password"
            color="indigo darken-1"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.confirmPassword"
            :rules="confirmPasswordRules"
            type="password"
            label="Confirm Password"
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
  data(vm) {
    return {
      valid: true,
      user: {
        username: '',
        displayName: '',
        imageUrl: '',
        password: '',
        confirmPassword: '',
      },
      emptyRules: [
        (value) => !!value || 'Can not be empty',
      ],
      confirmPasswordRules: [
        (confirmPassword) => confirmPassword === vm.user.password || 'Password must match',
      ],
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate();

      if (this.valid) {
        // sign up
        const { User } = this.$FeathersVuex.api;
        const user = new User(this.user);
        user.save()
          .then((created) => {
            console.log(created);
          });
      }
    },
  },
};
</script>
