<template>
  <v-app v-if="!isLoading">
    <Header :color="bgColor('darken-3')" />

    <v-content :class="bgColor('darken-2')">
      <!-- fixed side menu -->
      <BoardMenu
        :show="showBoardMenu"
        @hide="showBoardMenu=false"
      ></BoardMenu>

      <v-container fluid>
        <!-- header area -->
        <v-row class="ma-0">
          <h1 class="headline" :class="textColor('lighten-5')">{{ board.name }}</h1>
          <v-spacer></v-spacer>
          <v-btn
            :color="bgColor('lighten-3')"
            :class="textColor('darken-3')"
            @click="showBoardMenu=true"
            :ripple="false"
          >Board Menu</v-btn>
        </v-row>

        <!-- main content -->
        <v-row v-if="!findListsLoading">
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
              :color="bgColor('lighten-3')"
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
      isLoading: false,
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
    ...mapGetters('board', ['bgColor', 'textColor']),
    lists() {
      return this.findListsInStore({
        query: { boardId: this.board._id },
      }).data;
    },
  },
  methods: {
    ...mapActions('boards', { getBoardById: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
    ...mapActions('board', ['setBoard']),
  },
  async created() {
    try {
      this.isLoading = true;
      const board = await this.getBoardById(this.$route.params.board_id);
      this.setBoard(board);
      this.isLoading = false;

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
