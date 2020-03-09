<template>
  <v-app>
    <Header />

    <v-content>
      <v-container fluid>
        <v-row>
          {{ $route.params.board_id}}
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
  name: 'Board',
  components: {
    Header,
  },
};
</script>
