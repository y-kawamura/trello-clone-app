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
          <v-col cols="12" sm="6" md="3" v-for="board in boards" :key="board._id">
            <v-card
              link
              :to="{ name: 'Board', params: { board_id: board._id } }"
              hover
              dark
              :img="board.backgroundImage"
              :color="board.backgroundColor"
              height="120"
            >
              <v-card-title>
                {{ board.name }}
              </v-card-title>
              <v-card-actions v-if="isBoardOwner(board)" class="mb-2">
                <v-spacer></v-spacer>
                <v-btn icon @click.prevent="showBoardEdit(board)">
                  <v-icon>mdi-square-edit-outline</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-dialog v-if="isShowBoardEdit" v-model="isShowBoardEdit" width="400">
            <BoardEdit
              :editBoard="editBoard"
              @cencel="isShowBoardEdit = false"
              @update="isShowBoardEdit = false"
            />
          </v-dialog>

          <!-- new board -->
          <v-dialog v-model="isShowBoardForm" width="400">
            <template v-slot:activator="{ on }">
              <v-col cols="12" sm="6" md="3">
                <v-card
                  v-on="on"
                  link
                  hover
                  height="115px"
                  color="grey lighten-3"
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
              @cencel="isShowBoardForm = false"
              @create="isShowBoardForm = false"
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
import BoardEdit from '@/components/BoardEdit.vue';

export default {
  name: 'Boards',
  components: {
    Header,
    BoardForm,
    BoardEdit,
  },
  data() {
    return {
      editBoard: null,
      isShowBoardEdit: false,
      isShowBoardForm: false,
    };
  },
  computed: {
    ...mapState('boards', { isBoardsLoading: 'isFindPending' }),
    ...mapGetters('auth', ['user']),
    ...mapGetters('boards', { findBoardsInStore: 'find' }),
    boards() {
      return this.findBoardsInStore({
        query: {
          $or: [
            { ownerId: this.user._id },
            { members: this.user._id },
          ],
        },
      }).data;
    },
    isBoardOwner() {
      return (board) => board.ownerId === this.user._id;
    },
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
    showBoardEdit(board) {
      this.editBoard = board;
      this.isShowBoardEdit = true;
    },
  },
  created() {
    this.findBoards({});
  },
};
</script>
