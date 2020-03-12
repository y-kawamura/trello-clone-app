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
        v-for="card in cards(list)"
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
  data() {
    return {
      draggingCard: null,
      droppingList: null,
    };
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
    isDroppingTarget: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState('cards', { findCardsLoading: 'isFindPending' }),
    ...mapGetters('cards', { findCardsInStore: 'find' }),
    cardColor() {
      return this.isDroppingTarget ? `${this.board.background} lighten-3` : 'grey lighten-3';
    },
    cards() {
      return (list) => this.findCardsInStore({
        // eslint-disable-next-line no-underscore-dangle
        query: { listId: list._id },
      }).data;
    },
  },
  methods: {
    ...mapActions('cards', { findCards: 'find' }),
    onCardDragStart(card) {
      this.$emit('dragcard', card);
    },
    onCardDragEnd() {
      this.$emit('dropcard');
    },
    onListDragOver(event) {
      this.$emit('dragoverlist', this.list);
      event.preventDefault();
    },
    onListDragLeave() {
      this.$emit('dragleavelist');
    },
  },
  created() {
    this.findCards({
      // eslint-disable-next-line no-underscore-dangle
      query: { listId: this.list._id },
    });
  },
};
</script>
