<template>
  <v-card>
    <v-card-title>
      Add member
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-checkbox
          v-for="user in notMemberUsers"
          :key="user._id"
          v-model="user.select"
          :label="`${user.displayName} @${user.username}`"
          >
        </v-checkbox>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="teal"
            outlined
            large
            @click="cencel"
          >Cancel</v-btn>
          <v-btn
            @click="addMembers"
            color="teal"
            class="white--text"
            depressed
            large
          >Add</v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'InvestigateForm',
  computed: {
    ...mapState('board', ['board']),
    ...mapGetters('users', { findUserInStore: 'find' }),
    users() {
      return this.findUserInStore({}).data;
    },
    notMemberUsers() {
      return this.users.filter(
        (user) => (!this.board.members.includes(user._id) && this.board.ownerId !== user._id),
      );
    },
  },
  methods: {
    ...mapActions('users', { findUser: 'find' }),
    async addMembers() {
      const newMember = this.notMemberUsers.reduce((members, user) => {
        if (user.select) {
          members.push(user._id);
        }
        return members;
      }, []);
      this.board.members.push(...newMember);
      await this.board.save();
      this.clear();
      this.$emit('update');
    },
    clear() {
      this.users.forEach((user) => {
        // eslint-disable-next-line no-param-reassign
        user.select = false;
      });
    },
    cencel() {
      this.clear();
      this.$emit('cancel');
    },
  },
  async created() {
    await this.findUser({});
  },
};
</script>
