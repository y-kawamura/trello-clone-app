<template>
  <div v-if="!isFindPending">
    <v-avatar color="white" size="32" class="mx-2">
      <img
        :src="userImage(owner)"
        :alt="owner.displayName"
      >
    </v-avatar>
    <v-avatar
      v-for="member in members"
      :key="member._id"
      color="white"
      size="32"
      class="mx-1"
    >
      <img
        :src="userImage(member)"
        :alt="member.displayName"
      >
    </v-avatar>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import anonymousAvatar from '@/assets/avatar.png';

export default {
  name: 'MemberList',
  computed: {
    ...mapState('board', ['board']),
    ...mapState('users', ['isFindPending']),
    ...mapGetters('users', { findUserInStore: 'find' }),
    userById() {
      return (_id) => this.findUserInStore({ query: { _id } }).data[0];
    },
    owner() {
      return this.userById(this.board.ownerId);
    },
    members() {
      return this.board.members.map((memberId) => this.userById(memberId));
    },
    userImage() {
      return (user) => user.imageUrl || anonymousAvatar;
    },
  },
  methods: {
    ...mapActions('users', { findUser: 'find' }),
  },
  created() {
    this.findUser({ query: {} });
  },
};
</script>

<style>

</style>
