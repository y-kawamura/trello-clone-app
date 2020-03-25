<template>
  <v-app>
    <Header />

    <v-content>
      <v-container fluid py-0>
        <v-snackbar
          v-model="updatedNotify"
          top
          right
          color="indigo"
          multi-line
          :timeout="updateNotifyTimeout"
        >
          Updated your information
        </v-snackbar>

        <v-row justify="center" align="center" class="py-10" style="background: #f1f1f1;">
          <v-avatar color="white" size="64" class="mx-2">
            <img
              :src="userImage"
              alt="User image"
            >
          </v-avatar>
          <span class="display-1 ml-2">
            {{ user.displayName }}
          </span>
          <span class="headline ml-2 font-italic font-weight-light">
            @{{ user.username}}
          </span>
        </v-row>
        <v-row>
          <v-col sm="8" offset-sm="2" md="6" offset-md="3">
            <h2 class="mt-5 mb-10 font-weight-light">User Information</h2>
            <v-form
              v-model="valid"
              ref="form"
              lazy-validation
            >
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
              <v-btn
                class="my-4"
                color="indigo darken-1"
                dark
                @click="update"
              >
                Save
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Header from '@/components/Header.vue';
import anonymousAvatar from '@/assets/avatar.png';


export default {
  name: 'Boards',
  components: {
    Header,
  },
  data() {
    return {
      updatedNotify: false,
      updateNotifyTimeout: 1500,
      valid: false,
      emptyRules: [
        (value) => !!value || 'Can not be empty',
      ],
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),
    userImage() {
      return this.user.imageUrl || anonymousAvatar;
    },
  },
  methods: {
    ...mapActions('users', { updateUser: 'patch' }),
    async update() {
      const data = {
        displayName: this.user.displayName,
        imageUrl: this.user.imageUrl,
      };
      await this.updateUser([this.user._id, data, {}]);
      this.updatedNotify = true;
    },
  },
};
</script>
