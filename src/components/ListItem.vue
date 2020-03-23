<template>
  <v-card
    :color="cardColor"
    @dragover="onListDragOver($event)"
    @dragleave="onListDragLeave"
  >
    <v-card-title class="pa-0">
      <span
        class="py-2 px-3"
        @click="showListForm"
        v-if="!isShowListForm"
      >
        {{ list.name }}
      </span>
      <v-form
        class="pa-1"
        v-if="isShowListForm"
        @submit.prevent="updateListName"
        style="width: 100%;"
      >
        <v-text-field
          v-model="newListName"
          outlined
          hide-details
          dense
          flat
          autofocus
          full-width
          @blur="isShowListForm=false"
        >
        </v-text-field>
      </v-form>
    </v-card-title>

    <!-- cards -->
    <div class="card-list">
      <CardItem
        v-for="card in cards"
        :key="card._id"
        :cardId="card._id"
        class="ma-2"
      >
      </CardItem>
    </div>

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
  data() {
    return {
      isShowListForm: false,
      newListName: '',
    };
  },
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
    showListForm() {
      // set current title when edit form opened
      this.newListName = this.list.name;
      this.isShowListForm = true;
    },
    async updateListName() {
      this.list.name = this.newListName;
      await this.list.save();
      this.isShowListForm = false;
    },
  },
  created() {
    this.findCards({
      query: { listId: this.list._id },
    });
  },
};
</script>

<style scoped>
.card-list {
  max-height: 55vh;
  overflow-y: auto;
}
</style>
