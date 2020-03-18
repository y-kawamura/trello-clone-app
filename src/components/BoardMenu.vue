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
          Board Menu
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item>
        <v-list-item-content>Activity Log</v-list-item-content>
      </v-list-item>
      <ActivityLogList />
    </v-list>
  </v-slide-x-reverse-transition>
</template>

<script>
import { mapGetters } from 'vuex';
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
