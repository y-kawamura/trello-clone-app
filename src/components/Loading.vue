<template>
  <v-overlay v-if="isLoading" opacity="0.3">
    <v-progress-circular
      :size="70"
      color="indigo accent-4"
      indeterminate
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Loading',
  computed: {
    ...mapState('users', { userCreating: 'isCreatePending' }),
    ...mapState('boards', { boardCreating: 'isCreatePending' }),
    ...mapState('boards', { boardGetting: 'isGetPending' }),
    ...mapState('lists', { listCreating: 'isCreatePending' }),
    ...mapState('auth', ['isAuthenticatePending']),
    isLoading() {
      return this.userCreating
        || this.boardCreating
        || this.boardGetting
        || this.listCreating
        || this.isAuthenticatePending;
    },
  },
};
</script>
