<template>
  <v-app>
    <Header :color="headerColor" />

    <v-content :class="bodyColor">
      <!-- fixed side menu -->
      <BoardMenu
        v-if="!getBoardLoading"
        :color="color"
        :board="board"
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
              :board="board"
              :isDroppingTarget="isDroppingTarget(list)"
              @dragcard="startDraggingCard"
              @dropcard="endDraggingCard"
              @dragoverlist="setDroppingList"
              @dragleavelist="removeDroppingList"
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
              :boardId="this.$route.params.board_id"
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
      draggingCard: null,
      droppingList: null,
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
    ...mapGetters('boards', { getBoardByIdInStore: 'get' }),
    ...mapGetters('lists', { findListsInStore: 'find' }),
    board() {
      return this.getBoardByIdInStore(this.$route.params.board_id);
    },
    lists() {
      return this.findListsInStore({
        query: { boardId: this.$route.params.board_id },
      }).data;
    },
    listById() {
      return (id) => this.lists.find((list) => list._id === id);
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
    isDroppingTarget() {
      return (list) => this.droppingList === list;
    },
  },
  methods: {
    ...mapActions('boards', { getBoardById: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
    startDraggingCard(card) {
      this.draggingCard = card;
    },
    async endDraggingCard() {
      if (this.droppingList) {
        const fromListName = this.listById(this.draggingCard.listId).name;
        const toListName = this.droppingList.name;

        this.draggingCard.listId = this.droppingList._id;
        await this.draggingCard.save();

        const { Activity } = this.$FeathersVuex.api;
        const newActivity = new Activity({
          text: `${this.draggingCard.title} カードを ${fromListName} リストから ${toListName} リストに移動しました`,
          boardId: this.board._id,
        });
        newActivity.save();
      }
      this.draggingCard = null;
      this.droppingList = null;
    },
    setDroppingList(list) {
      if (this.draggingCard.listId !== list._id) {
        this.droppingList = list;
      }
    },
    removeDroppingList() {
      this.droppingList = null;
    },
  },
  async created() {
    try {
      await this.getBoardById(this.$route.params.board_id);

      this.findLists({
        query: { boardId: this.$route.params.board_id },
      });
    } catch (error) {
      // owner id is not matched as current user id
      // board id is not found
      this.$router.push('/boards');
    }
  },
};
</script>
