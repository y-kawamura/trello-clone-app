<template>
  <v-app>
    <Header :color="headerColor" />

    <v-content :class="bodyColor">
      <v-container fluid>
        <v-row>
          <pre>{{board}}</pre>
          <pre>{{lists}}</pre>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Header from '@/components/Header.vue';

export default {
  name: 'Board',
  components: {
    Header,
  },
  computed: {
    ...mapGetters('boards', { getBoardByIdInStore: 'get' }),
    ...mapGetters('lists', { findListsInStore: 'find' }),
    board() {
      return this.getBoardByIdInStore(this.$route.params.board_id);
    },
    lists() {
      return this.findListsInStore({
        query: { boardId: this.$route.params.board_id },
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
  },
  methods: {
    ...mapActions('boards', { getBoardById: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
  },
  created() {
    this.getBoardById(this.$route.params.board_id);
    this.findLists({
      query: { boardId: this.$route.params.board_id },
    });
  },
};
</script>
