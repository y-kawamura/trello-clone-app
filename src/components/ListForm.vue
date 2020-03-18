<template>
  <v-card
    hover
    :color="linkColor"
  >
    <v-card-text class="pa-2">
      <v-form @submit.prevent="createList">
        <v-text-field
          v-model="list.name"
          outlined
          hide-details
          class="mb-1"
          dense
          flat
          :color="bodyColor"
          placeholder="Input list title..."
          autofocus
        >
        </v-text-field>
        <v-btn type="submit" :color="headerColor" dark depressed class="mr-1">Add</v-btn>
        <v-btn :color="headerColor" outlined @click="$emit('cancel')">Close</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';


export default {
  name: 'ListForm',
  data() {
    return {
      list: {
        name: '',
      },
    };
  },
  props: {
    background: {
      type: String,
      requierd: true,
    },
  },
  computed: {
    ...mapState('board', ['board']),
    isValid() {
      return !!this.list.name;
    },
    headerColor() {
      return `${this.background} darken-3`;
    },
    bodyColor() {
      return `${this.background} darken-2`;
    },
    linkColor() {
      return `${this.background} lighten-3`;
    },
  },
  methods: {
    createList() {
      if (this.isValid) {
        const { List } = this.$FeathersVuex.api;
        this.list.boardId = this.board._id;
        const list = new List(this.list);
        list.save()
          .then(() => {
            const { Activity } = this.$FeathersVuex.api;
            const newActivity = new Activity({
              text: `${this.list.name} リストを作成しました`,
              boardId: this.board._id,
            });
            newActivity.save();

            this.$emit('create');
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
  },
};
</script>
