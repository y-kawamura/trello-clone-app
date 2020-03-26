<template>
  <v-app v-if="!isLoading">
    <Header :color="bgColor('darken-3')" />

    <v-content :style="bgStyle" :class="bgColor('darken-2')">
      <!-- fixed side menu -->
      <BoardMenu
        :show="showBoardMenu"
        @hide="showBoardMenu=false"
      ></BoardMenu>

      <v-container fluid ma-0 pa-0>

        <!-- Investigation Form -->
        <v-dialog v-if="isShowInvestigation" v-model="isShowInvestigation" width="400">
          <InvestigateForm
            @cancel="isShowInvestigation = false"
            @update="isShowInvestigation = false"
          />
        </v-dialog>

        <!-- header area -->
        <v-row class="mx-3 mt-3 mb-2">
          <h1
            class="headline font-weight-bold"
            :class="textColor('lighten-5')"
          >{{ board.name }}</h1>
          <MemberList />
          <v-btn
            :color="bgColor('lighten-3')"
            :class="textColor('darken-3')"
            class="ml-2"
            @click="isShowInvestigation=true"
          >Investigation</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :color="bgColor('lighten-3')"
            :class="textColor('darken-3')"
            @click="showBoardMenu=true"
            :ripple="false"
          >Board Menu</v-btn>
        </v-row>

        <!-- main content -->
        <div v-if="!findListsLoading" class="d-flex board">
          <div
            v-for="list in lists"
            :key="list._id"
          >
            <ListItem
              class="list"
              :list="list"
            ></ListItem>
          </div>

          <!-- New list -->
          <div>
            <v-card
              v-if="!showListForm"
              hover
              :color="bgColor('lighten-3')"
              class="list"
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
              @create="showListForm=false"
              @cancel="showListForm=false"
              class="list"
            />
          </div>
        </div>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import Header from '@/components/Header.vue';
import ListItem from '@/components/ListItem.vue';
import ListForm from '@/components/ListForm.vue';
import BoardMenu from '@/components/BoardMenu.vue';
import InvestigateForm from '@/components/InvestigateForm.vue';
import MemberList from '@/components/MemberList.vue';

export default {
  name: 'Board',
  data() {
    return {
      isShowInvestigation: false,
      showBoardMenu: false,
      showListForm: false,
      isLoading: false,
    };
  },
  components: {
    Header,
    ListItem,
    ListForm,
    BoardMenu,
    InvestigateForm,
    MemberList,
  },
  computed: {
    ...mapState('boards', { getBoardLoading: 'isGetPending' }),
    ...mapState('lists', { findListsLoading: 'isFindPending' }),
    ...mapState('board', ['board']),
    ...mapGetters('lists', { findListsInStore: 'find' }),
    ...mapGetters('board', ['bgColor', 'textColor']),
    lists() {
      return this.findListsInStore({
        query: { boardId: this.board._id },
      }).data;
    },
    bgStyle() {
      return `
        background-image: url(${this.board.backgroundImage});
        background-size: cover;
        background-position: center;
      `;
    },
  },
  methods: {
    ...mapActions('boards', { getBoardById: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
    ...mapActions('board', ['setBoard']),
  },
  async created() {
    try {
      this.isLoading = true;
      const board = await this.getBoardById(this.$route.params.board_id);
      this.setBoard(board);
      this.isLoading = false;

      this.findLists({
        query: { boardId: this.board._id },
      });
    } catch (error) {
      // owner id is not matched as current user id
      // board id is not found
      this.$router.push('/boards');
    }
  },
};
</script>

<style scoped>
.board {
  overflow-x: scroll;
  height: 80vh;
}
.list {
  width: 17.5rem;
  max-height: 75vh;
  margin: 0.5rem;
}
</style>
