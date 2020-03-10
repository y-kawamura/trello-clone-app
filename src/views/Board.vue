<template>
  <v-app>
    <Header :color="headerColor" />

    <v-content :class="bodyColor">
      <v-container fluid>
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
                  :listId="list._id"
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
import { mapGetters, mapActions } from 'vuex';
import Header from '@/components/Header.vue';
import ListForm from '@/components/ListForm.vue';
import CardForm from '@/components/CardForm.vue';

export default {
  name: 'Board',
  data() {
    return {
      showListForm: false,
      draggingCard: null,
      droppingList: null,
    };
  },
  components: {
    Header,
    ListForm,
    CardForm,
  },
  computed: {
    ...mapGetters('boards', { getBoardByIdInStore: 'get' }),
    ...mapGetters('lists', { findListsInStore: 'find' }),
    ...mapGetters('cards', { findCardsInStore: 'find' }),
    board() {
      return this.getBoardByIdInStore(this.$route.params.board_id);
    },
    lists() {
      return this.findListsInStore({
        query: { boardId: this.$route.params.board_id },
      }).data;
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
    endDraggingCard() {
      if (this.droppingList) {
        // eslint-disable-next-line no-underscore-dangle
        this.draggingCard.listId = this.droppingList._id;
        this.draggingCard.save();
      }
      this.draggingCard = null;
      this.droppingList = null;
    },
    setDroppingList(event, list) {
      this.droppingList = list;
      event.preventDefault();
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
