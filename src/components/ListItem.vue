<template>
  <v-card
    :color="cardColor"
    @dragover="onListDragOver($event)"
    @dragleave="onListDragLeave"
  >
    <v-card-text class="pa-2">{{ list.name }}</v-card-text>

    <!-- cards -->
    <template>
      <v-card
        v-for="card in cards"
        :key="card._id"
        draggable="true"
        @dragstart="onCardDragStart(card)"
        @dragend="onCardDragEnd"
        class="ma-2"
      >
        <v-card-text class="pa-2">
          {{ card.title }}
        </v-card-text>
      </v-card>
    </template>

    <!-- new card form -->
    <v-card-text class="pa-2">
      <CardForm
        :list="list"
        :board="board"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import CardForm from '@/components/CardForm.vue';

export default {
  name: 'ListItem',
  components: {
    CardForm,
  },
  props: {
    list: {
      type: Object,
      required: true,
    },
    board: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('cards', { findCardsLoading: 'isFindPending' }),
    ...mapState('board', ['draggingCard', 'droppingList']),
    ...mapGetters('cards', { findCardsInStore: 'find' }),
    ...mapGetters('lists', { getListInStore: 'get' }),
    isOwnDraggingCard() {
      return this.draggingCard.listId === this.list._id;
    },
    cardColor() {
      return this.droppingList === this.list ? `${this.board.background} lighten-3` : 'grey lighten-3';
    },
    cards() {
      return this.findCardsInStore({
        query: { listId: this.list._id },
      }).data;
    },
  },
  methods: {
    ...mapActions('cards', { findCards: 'find' }),
    ...mapActions('board', ['setDraggingCard', 'setDroppingList']),
    onCardDragStart(card) {
      this.setDraggingCard(card);
    },
    async onCardDragEnd() {
      if (this.droppingList) {
        // save list name of a dragging card before the card updates
        const fromListName = this.getListInStore(this.draggingCard.listId).name;
        const toListName = this.droppingList.name;

        // update card list id
        this.draggingCard.listId = this.droppingList._id;
        await this.draggingCard.save();

        // store activity log
        const { Activity } = this.$FeathersVuex.api;
        const newActivity = new Activity({
          text: `${this.draggingCard.title} カードを ${fromListName} リストから ${toListName} リストに移動しました`,
          boardId: this.board._id,
        });
        await newActivity.save();
      }

      this.setDraggingCard(null);
      this.setDroppingList(null);
    },
    onListDragOver(event) {
      if (this.draggingCard && !this.isOwnDraggingCard) {
        this.setDroppingList(this.list);
      }
      event.preventDefault();
    },
    onListDragLeave() {
      this.setDroppingList(null);
    },
  },
  created() {
    this.findCards({
      query: { listId: this.list._id },
    });
  },
};
</script>
