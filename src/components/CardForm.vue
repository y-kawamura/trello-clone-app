<template>
  <div>
    <button
      v-if="!showForm"
      @click="showForm=true"
      class="new-task-button"
    >
      + Add new task
    </button>
    <v-form
      v-if="showForm"
      @submit.prevent="createCard"
    >
      <v-text-field
        v-model="card.title"
        outlined
        hide-details
        class="mb-1"
        dense
        flat
        :color="bgColor('darken-2')"
        placeholder="Input card title..."
        autofocus
      >
      </v-text-field>
      <v-btn type="submit" :color="bgColor('darken-3')" dark depressed class="mr-1">Add</v-btn>
      <v-btn :color="bgColor('darken-3')" outlined @click="showForm=false">Close</v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'CardForm',
  data() {
    return {
      card: {
        title: '',
      },
      showForm: false,
    };
  },
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('board', ['board']),
    ...mapGetters('board', ['bgColor']),
    isValid() {
      return !!this.card.title;
    },
  },
  methods: {
    createCard() {
      if (this.isValid) {
        const { Card } = this.$FeathersVuex.api;
        this.card.listId = this.list._id;
        const card = new Card(this.card);
        card.save()
          .then((created) => {
            const { Activity } = this.$FeathersVuex.api;
            const newActivity = new Activity({
              text: `${this.list.name} リストに ${this.card.title} カードを作成しました`,
              boardId: this.board._id,
              cardId: created._id,
            });
            newActivity.save();

            this.card = {
              title: '',
            };
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
  },
};
</script>

<style scoped>
.new-task-button {
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  width: 100%;
  text-align: left;
}
button:hover {
  color: #111;
  background-color: #ddd;
}

</style>
