<template>
  <v-app>
    <Header :color="headerColor" />

    <v-content :class="bodyColor">
      <v-container fluid>
        <v-row>
          <v-col
            cols="4"
            v-for="list in lists"
            :key="list._id"
          >
            <v-card
              color="grey lighten-3"
            >
              <v-card-text class="pa-2">{{ list.name }}</v-card-text>
            </v-card>
          </v-col>

          <!-- New list -->
          <v-col cols="4">
            <v-card
              v-if="!showListForm"
              hover
              :color="linkColor"
            >
              <v-card-text
                @click="showListForm = true"
                class="pa-2"
              >
                + Add new list
              </v-card-text>
            </v-card>
            <ListForm
              v-if="showListForm"
              :boardId="this.$route.params.board_id"
              :background="color"
              @create="showListForm=false"
              @cancel="showListForm=false"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Header from '@/components/Header.vue';
import ListForm from '@/components/ListForm.vue';

export default {
  name: 'Board',
  data() {
    return {
      showListForm: false,
    };
  },
  components: {
    Header,
    ListForm,
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
    linkColor() {
      return this.board
        ? `${this.board.background} lighten-3`
        : 'white';
    },
    color() {
      return this.board
        ? `${this.board.background}`
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
