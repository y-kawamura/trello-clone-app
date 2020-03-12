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
        <v-row class="ma-0">
          <h1 class="headline" :class="`${color}--text text--lighten-5`">{{ boardName }}</h1>
          <v-spacer></v-spacer>
          <v-btn
            :color="linkColor"
            :class="`${color}--text text--darken-4`"
            @click="showBoardMenu=true"
            :ripple="false"
          >Board Menu</v-btn>
        </v-row>

        <!-- main content -->
        <v-row>
          <v-col
            cols="4"
            v-for="list in lists"
            :key="list._id"
          >
            <v-card
              :color="droppingColor(list)"
              @dragover="setDroppingList($event, list)"
              @dragleave="removeDroppingList()"
            >
              <v-card-text class="pa-2">{{ list.name }}</v-card-text>
              <v-card
                v-for="card in cards(list)"
                :key="card._id"
                draggable="true"
                @dragstart="startDraggingCard(card)"
                @dragend="endDraggingCard()"
                class="ma-2"
              >
                <v-card-text class="pa-2">
                  {{ card.title }}
                </v-card-text>
              </v-card>
              <v-card-text class="pa-2">
                <CardForm
                  :list="list"
                  :boardId="board._id"
                  :background="color"
                />
              </v-card-text>
            </v-card>
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
import ListForm from '@/components/ListForm.vue';
import CardForm from '@/components/CardForm.vue';
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
    ListForm,
    CardForm,
    BoardMenu,
  },
  computed: {
    ...mapState('boards', { getBoardLoading: 'isGetPending' }),
    ...mapState('lists', { findListsLoading: 'isFindPending' }),
    ...mapState('cards', { findCardsLoading: 'isFindPending' }),
    ...mapGetters('boards', { getBoardByIdInStore: 'get' }),
    ...mapGetters('lists', { findListsInStore: 'find' }),
    ...mapGetters('cards', { findCardsInStore: 'find' }),
    board() {
      return this.getBoardByIdInStore(this.$route.params.board_id);
    },
    boardName() {
      return this.board
        ? this.board.name
        : '';
    },
    lists() {
      return this.findListsInStore({
        query: { boardId: this.$route.params.board_id },
      }).data;
    },
    listById() {
      // eslint-disable-next-line no-underscore-dangle
      return (id) => this.lists.find((list) => list._id === id);
    },
    cards() {
      return (list) => this.findCardsInStore({
        // eslint-disable-next-line no-underscore-dangle
        query: { listId: list._id },
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
    droppingColor() {
      return (list) => (this.droppingList === list
        ? this.linkColor
        : 'grey lighten-3'
      );
    },
  },
  methods: {
    ...mapActions('boards', { getBoardById: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
    ...mapActions('cards', { findCards: 'find' }),
    startDraggingCard(card) {
      this.draggingCard = card;
    },
    async endDraggingCard() {
      if (this.droppingList) {
        const fromListName = this.listById(this.draggingCard.listId).name;
        const toListName = this.droppingList.name;

        // eslint-disable-next-line no-underscore-dangle
        this.draggingCard.listId = this.droppingList._id;
        await this.draggingCard.save();

        const { Activity } = this.$FeathersVuex.api;
        const newActivity = new Activity({
          text: `${this.draggingCard.title} カードを ${fromListName} リストから ${toListName} リストに移動しました`,
          // eslint-disable-next-line no-underscore-dangle
          boardId: this.board._id,
        });
        newActivity.save();
      }
      this.draggingCard = null;
      this.droppingList = null;
    },
    setDroppingList(event, list) {
      // eslint-disable-next-line no-underscore-dangle
      if (this.draggingCard.listId !== list._id) {
        this.droppingList = list;
        event.preventDefault();
      }
    },
    removeDroppingList() {
      this.droppingList = null;
    },
  },
  async created() {
    try {
      await this.getBoardById(this.$route.params.board_id);

      const lists = await this.findLists({
        query: { boardId: this.$route.params.board_id },
      });

      lists.data.forEach((list) => {
        this.findCards({
          // eslint-disable-next-line no-underscore-dangle
          query: { listId: list._id },
        });
      });
    } catch (error) {
      // owner id is not matched as current user id
      // board id is not found
      this.$router.push('/boards');
    }
  },
};
</script>
