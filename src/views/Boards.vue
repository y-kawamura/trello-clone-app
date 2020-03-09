<template>
  <v-app>
    <Header />

    <v-content>
      <v-container fluid>
        <v-row>
          <v-col v-if="isBoardsLoading" cols="12" sm="6" md="4">
            <v-card height="150px">
              <v-card-title class="justify-center" style="height:100%;">
                <v-progress-circular
                  :size="60"
                  :width="4"
                  color="indigo"
                  indeterminate
                ></v-progress-circular>
              </v-card-title>
          </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="4" v-for="board in boards" :key="board._id">
            <v-card link hover height="150px" dark :color="board.background">
              <v-card-title>
                {{ board.name }}
              </v-card-title>
            </v-card>
          </v-col>

          <!-- new board -->
          <v-dialog v-model="showBoardForm" width="400">
            <template v-slot:activator="{ on }">
              <v-col cols="12" sm="6" md="4">
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
import { mapState, mapGetters, mapActions } from 'vuex';
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
    };
  },
  computed: {
    ...mapState('boards', { isBoardsLoading: 'isFindPending' }),
    ...mapGetters('auth', ['user']),
    ...mapGetters('boards', { findBoardsInStore: 'find' }),
    boards() {
      return this.findBoardsInStore().data;
    },
  },
  methods: {
    ...mapActions('auth', { authLogout: 'logout' }),
    ...mapActions('boards', { findBoards: 'find' }),
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
  created() {
    this.findBoards({ query: {} });
  },
};
</script>
