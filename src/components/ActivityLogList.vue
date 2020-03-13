<template>
  <v-list :color="`${color} lighten-4`" dense>
    <!-- progress circle -->
    <v-list-item v-if="isLoading">
      <v-list-item-content>
        <v-progress-circular
          :size="50"
          color="indigo accent-4"
          indeterminate
        ></v-progress-circular>
      </v-list-item-content>
    </v-list-item>

    <template v-if="!isLoading">
      <v-list-item
        v-for="activity in activityLogsOnBoard"
        :key="activity._id"
      >
        <v-list-item-avatar>
          <v-img v-if="hasUserImage(activity.userId)" :src=userImage(activity.userId)></v-img>
          <v-icon v-else>mdi-account</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          {{ completeLog(activity) }}
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'ActivityLogList',
  props: {
    board: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState('activities', { isActivitiesLoading: 'isFindPending' }),
    ...mapState('users', { isUsersLoading: 'isGetPending' }),
    ...mapGetters('activities', { findActivitiesInStore: 'find' }),
    ...mapGetters('users', { getUserInStore: 'get' }),
    activityLogsOnBoard() {
      return this.findActivitiesInStore({
        query: {
          boardId: this.board._id,
        },
      }).data;
    },
    isLoading() {
      return this.isActivitiesLoading || this.isUsersLoading;
    },
    userById() {
      return (userId) => this.getUserInStore(userId);
    },
    completeLog() {
      return (activity) => `${this.userById(activity.userId).displayName} さんが ${activity.text}`;
    },
    hasUserImage() {
      return (userId) => !!this.userById(userId).imageUrl;
    },
    userImage() {
      return (userId) => this.userById(userId).imageUrl;
    },
  },
  methods: {
    ...mapActions('activities', { findActivities: 'find' }),
    ...mapActions('users', { getUser: 'get' }),
  },
  created() {
    this.findActivities({
      query: {
        boardId: this.board._id,
      },
    });

    this.getUser(this.board.ownerId);
  },
};
</script>

<style scoped>
.v-list {
  max-height: 85%;
  overflow-y: scroll;
}
</style>
