<template>
  <v-app>
    <Header />

    <v-content>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="4">
            <v-card link hover height="150px" dark color="cyan">
              <v-card-title>
                Todo
              </v-card-title>
            </v-card>
          </v-col>

          <!-- new board -->
          <v-dialog v-model="showBoardForm" width="400">
            <template v-slot:activator="{ on }">
              <v-col cols="12" md="4">
                <v-card
                  v-on="on"
                  link
                  hover
                  height="150px"
                >
                  <v-row justify="center" style="height:100%;">
                    <v-card-title class="grey--text text--lighten-1">
                      + Add new board
                    </v-card-title>
                  </v-row>
                </v-card>
              </v-col>
            </template>

            <BoardForm
              @cencel="showBoardForm = false"
              @create="showBoardForm = false"
            />
          </v-dialog>

        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Header from '@/components/Header.vue';
import BoardForm from '@/components/BoardForm.vue';

export default {
  name: 'Boards',
  components: {
    Header,
    BoardForm,
  },
  data() {
    return {
      showBoardForm: false,
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
