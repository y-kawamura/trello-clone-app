<template>
  <v-card
    draggable="true"
    @dragstart="onCardDragStart(card)"
    @dragend="onCardDragEnd"
    @click="showEditForm"
    :ripple="false"
  >
    <v-card-text
      v-if="!isShowEditForm"
      class="pa-2"
    >
      {{ this.card.title }}
    </v-card-text>
    <v-form
      v-if="isShowEditForm"
      @submit.prevent="updateTitle"
    >
      <v-text-field
        v-model="newTitle"
        outlined
        hide-details
        dense
        flat
        autofocus
        @blur="isShowEditForm=false"
      >
      </v-text-field>
    </v-form>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'CardItem',
  data() {
    return {
      isShowEditForm: false,
      newTitle: '',
    };
  },
  props: {
    cardId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState('board', ['draggingCard', 'droppingList', 'board']),
    ...mapGetters('lists', { getListInStore: 'get' }),
    ...mapGetters('cards', { getCardInStore: 'get' }),
    card() {
      return this.getCardInStore(this.cardId);
    },
  },
  methods: {
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
    showEditForm() {
      // set current title when edit form opened
      this.newTitle = this.card.title;
      this.isShowEditForm = true;
    },
    async updateTitle() {
      this.card.title = this.newTitle;
      await this.card.save();
      this.isShowEditForm = false;
    },
  },
};
</script>
