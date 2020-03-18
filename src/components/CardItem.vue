<template>
  <v-card
    draggable="true"
    @dragstart="onCardDragStart(card)"
    @dragend="onCardDragEnd"
  >
    <v-card-text class="pa-2">
      {{ card.title }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'CardItem',
  props: {
    card: {
      type: Object,
      required: true,
    },
    board: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('board', ['draggingCard', 'droppingList']),
    ...mapGetters('lists', { getListInStore: 'get' }),
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
  },
};
</script>
