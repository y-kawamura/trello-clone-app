<template>
  <v-card light class="text--grey darken-4--text">
    <v-card-title>
      Edit Board
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="updateBoard">
        <v-text-field
          v-model="board.name"
          label="Borad Name"
          placeholder="new project..."
          outlined
          color="indigo"
          solo
          flat
          autofocus
        ></v-text-field>

        <p class="subtitle-1 mb-0">Choose your favorite color or image</p>
        <v-row>
          <v-col>
            <v-card
              flat
              width="100"
              height="100"
              :color="board.backgroundColor"
              class="color-board"
              :img="board.backgroundImage"
            ></v-card>
          </v-col>
          <v-col cols="6" sm="8">
            <v-row>
              <v-col
                cols="6" sm="4"
                v-for="color in colors"
                :key="color"
                class="pt-0 pl-0"
              >
                <v-card flat height="40" :color="color" @click="selectColor(color)"></v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-text-field
          v-model="board.backgroundImage"
          label="Image URL"
          color="indigo"
        ></v-text-field>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="teal"
            outlined
            large
            @click="$emit('cencel')"
          >Cancel</v-btn>
          <v-btn
            type="submit"
            :disabled="!isValid"
            color="teal"
            class="white--text"
            depressed
            large
          >Update</v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'BoardEdit',
  data() {
    return {
      board: {
        name: this.editBoard.name,
        backgroundColor: this.editBoard.backgroundColor,
        backgroundImage: this.editBoard.backgroundImage,
      },
      colors: [
        'red',
        'pink',
        'indigo',
        'blue',
        'cyan',
        'green',
        'amber',
        'orange',
        'brown',
      ],
    };
  },
  props: {
    editBoard: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isValid() {
      return (this.board.name && this.board.backgroundColor);
    },
  },
  methods: {
    updateBoard() {
      if (this.isValid) {
        this.editBoard.name = this.board.name;
        this.editBoard.backgroundColor = this.board.backgroundColor;
        this.editBoard.backgroundImage = this.board.backgroundImage;
        this.editBoard.save()
          .then(() => {
            this.$emit('update');
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    selectColor(color) {
      this.board.backgroundColor = color;
    },
  },
};
</script>

<style scoped>
.color-board {
  transition: background-color 0.6s ease;
}
</style>
