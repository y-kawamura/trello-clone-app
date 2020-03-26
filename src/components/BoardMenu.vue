<template>
  <v-slide-x-reverse-transition leave-absolute>
    <v-list
      v-if="show"
      height="100%"
      width="300"
      class="sidebar"
      :color="bgColor('lighten-4')"
    >
      <v-list-item :ripple="false" @click="$emit('hide')">
        <v-list-item-content :class="textColor('darken-4')">
          <v-row justify="space-between" align="center" class="mx-3">
            Board Menu
            <v-icon :class="textColor('darken-4')">mdi-chevron-double-right</v-icon>
          </v-row>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>
          <div class="d-flex justify-space-between align-center">
            Backgound
            <v-card
              width="80"
              height="50"
              :img="board.backgroundImage"
              :color="bgColor('darken-2')"
            ></v-card>
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>Activity Log</v-list-item-content>
      </v-list-item>
      <ActivityLogList />
    </v-list>
  </v-slide-x-reverse-transition>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import ActivityLogList from '@/components/ActivityLogList.vue';

export default {
  name: 'BoardMenu',
  components: {
    ActivityLogList,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState('board', ['board']),
    ...mapGetters('board', ['bgColor', 'textColor']),
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  right: 0;
  z-index: 1;
}
</style>
