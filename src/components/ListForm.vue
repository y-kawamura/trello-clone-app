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
    boardId: {
      type: String,
      required: true,
    },
    background: {
      type: String,
      requierd: true,
    },
  },
  computed: {
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
        this.list.boardId = this.boardId;
        const list = new List(this.list);
        list.save()
          .then(() => {
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
