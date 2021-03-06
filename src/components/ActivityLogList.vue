<template>
  <v-list :color="bgColor('lighten-4')" dense>
    <!-- progress circle -->
    <v-list-item v-if="isLoading">
      <v-list-item-content>
        <v-progress-circular
          :size="50"
          :color="bgColor('accent-4')"
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
          <v-img v-if="userImage(activity.userId)" :src=userImage(activity.userId)></v-img>
          <v-icon v-else>mdi-account</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <p class="log-text">{{ completeLog(activity) }}</p>
          <v-list-item-subtitle>{{ sinceTime(activity.createdAt )}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
import * as moment from 'moment';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'ActivityLogList',
  computed: {
    ...mapState('activities', { isActivitiesLoading: 'isFindPending' }),
    ...mapState('users', { isUsersLoading: 'isGetPending' }),
    ...mapState('board', ['board']),
    ...mapGetters('activities', { findActivitiesInStore: 'find' }),
    ...mapGetters('users', { getUserInStore: 'get' }),
    ...mapGetters('board', ['bgColor']),
    activityLogsOnBoard() {
      return this.findActivitiesInStore({
        query: this.querySortLatestLogOnBoard,
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
    userImage() {
      return (userId) => this.userById(userId).imageUrl;
    },
    sinceTime() {
      return (time) => moment(time).fromNow();
    },
    querySortLatestLogOnBoard() {
      return ({
        boardId: this.board._id,
        $sort: {
          createdAt: -1,
        },
      });
    },
  },
  methods: {
    ...mapActions('activities', { findActivities: 'find' }),
  },
  created() {
    this.findActivities({
      query: this.querySortLatestLogOnBoard,
    });
  },
};
</script>

<style scoped>
.v-list {
  max-height: 65%;
  overflow-y: scroll;
}
.log-text {
  font-size: 0.85rem;
  line-height: 1.1rem;
}
</style>
