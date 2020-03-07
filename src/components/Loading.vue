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
    ...mapState('users', ['isCreatePending']),
    ...mapState('auth', ['isAuthenticatePending']),
    isLoading() {
      return this.isCreatePending || this.isAuthenticatePending;
    },
  },
};
</script>
