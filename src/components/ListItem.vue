<template>
  <v-card
    :color="cardColor"
    @dragover="onListDragOver($event)"
    @dragleave="onListDragLeave"
  >
    <v-card-text class="pa-2">{{ list.name }}</v-card-text>

    <!-- cards -->
    <template>
      <CardItem
        v-for="card in cards"
        :key="card._id"
        :cardId="card._id"
        class="ma-2"
      >
      </CardItem>
    </template>

    <!-- new card form -->
    <v-card-text class="pa-2">
      <CardForm
        :list="list"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import CardItem from '@/components/CardItem.vue';
import CardForm from '@/components/CardForm.vue';

export default {
  name: 'ListItem',
  components: {
    CardItem,
    CardForm,
  },
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('cards', { findCardsLoading: 'isFindPending' }),
    ...mapState('board', ['draggingCard', 'droppingList', 'board']),
    ...mapGetters('cards', { findCardsInStore: 'find' }),
    ...mapGetters('board', ['bgColor']),
    isOwnDraggingCard() {
      return this.draggingCard.listId === this.list._id;
    },
    cardColor() {
      return this.droppingList === this.list ? this.bgColor('lighten-3') : 'grey lighten-3';
    },
    cards() {
      return this.findCardsInStore({
        query: { listId: this.list._id },
      }).data;
    },
  },
  methods: {
    ...mapActions('cards', { findCards: 'find' }),
    ...mapActions('board', ['setDroppingList']),
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
