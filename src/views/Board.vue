<template>
  <v-app>
    <Header :color="headerColor" />

    <v-content :class="bodyColor">
      <!-- fixed side menu -->
      <BoardMenu
        v-if="!getBoardLoading"
        :color="color"
        :show="showBoardMenu"
        @hide="showBoardMenu=false"
      ></BoardMenu>

      <v-container fluid>
        <!-- header area -->
        <v-row class="ma-0" v-if="!getBoardLoading">
          <h1 class="headline" :class="`${color}--text text--lighten-5`">{{ board.name }}</h1>
          <v-spacer></v-spacer>
          <v-btn
            :color="linkColor"
            :class="`${color}--text text--darken-4`"
            @click="showBoardMenu=true"
            :ripple="false"
          >Board Menu</v-btn>
        </v-row>

        <!-- main content -->
        <v-row v-if="!(getBoardLoading || findListsLoading)">
          <v-col
            cols="4"
            v-for="list in lists"
            :key="list._id"
          >
            <ListItem
              :list="list"
            ></ListItem>
          </v-col>

          <!-- New list -->
          <v-col cols="4">
            <v-card
              v-if="!showListForm"
              hover
              :color="linkColor"
            >
              <v-card-text
                @click="showListForm = true"
                class="pa-2"
              >
                + Add new list
              </v-card-text>
            </v-card>
            <ListForm
              v-if="showListForm"
              :background="color"
              @create="showListForm=false"
              @cancel="showListForm=false"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import Header from '@/components/Header.vue';
import ListItem from '@/components/ListItem.vue';
import ListForm from '@/components/ListForm.vue';
import BoardMenu from '@/components/BoardMenu.vue';

export default {
  name: 'Board',
  data() {
    return {
      showBoardMenu: false,
      showListForm: false,
    };
  },
  components: {
    Header,
    ListItem,
    ListForm,
    BoardMenu,
  },
  computed: {
    ...mapState('boards', { getBoardLoading: 'isGetPending' }),
    ...mapState('lists', { findListsLoading: 'isFindPending' }),
    ...mapState('board', ['board']),
    ...mapGetters('lists', { findListsInStore: 'find' }),
    lists() {
      return this.findListsInStore({
        query: { boardId: this.board._id },
      }).data;
    },
    headerColor() {
      return this.board
        ? `${this.board.background} darken-3`
        : 'white';
    },
    bodyColor() {
      return this.board
        ? `${this.board.background} darken-2`
        : 'white';
    },
    linkColor() {
      return this.board
        ? `${this.board.background} lighten-3`
        : 'white';
    },
    color() {
      return this.board
        ? `${this.board.background}`
        : 'white';
    },
  },
  methods: {
    ...mapActions('boards', { getBoardById: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
    ...mapActions('board', ['setBoard']),
  },
  async created() {
    try {
      const board = await this.getBoardById(this.$route.params.board_id);
      this.setBoard(board);

      this.findLists({
        query: { boardId: this.board._id },
      });
    } catch (error) {
      // owner id is not matched as current user id
      // board id is not found
      this.$router.push('/boards');
    }
  },
};
</script>
