<template>
  <div>
    <v-card
        elevation="4"
        dark
        :color="color"
        width="100%"
        min-height="50px"
        class="drop_area"
        @dragenter="dragEnter"
        @dragleave="dragLeave"
        @dragover.prevent="dragOver"
        @drop.prevent="dropFile"
    >
      <v-progress-linear
          v-if="isLoading"
          color="orange"
          height="10"
          indeterminate
      ></v-progress-linear>
      <v-card-title>
        クイックアップロード
      </v-card-title>
      <v-card-subtitle>
        追加したいURLをドラッグアンドドロップ
      </v-card-subtitle>
      <v-card-actions>
        <v-btn
            @click="fetchUrlFromClipboard"
            color="blue darken-4"
            width="100%">
          クリップボードからアップロード
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import url_utils from "@/mixins/mixin";
import {mapActions} from "vuex"

export default {
  name: "QuickAdd",
  mixins: [url_utils],
  data: () => {
    return {
      isEnter: false,
      draggedUrl: "",
      isLoading: false,
      snackbar: false,
      snackbarText: "",
    }
  },
  methods: {
    ...mapActions("bookmarks", ["quickAddBookmark"]),
    dragEnter() {
      console.log('Enter Drop Area');
      this.isEnter = true
    },
    dragLeave() {
      this.isEnter = false;
    },
    dragOver() {
    },
    async dropFile(event) {
      this.isLoading = true
      this.isEnter = false
      this.draggedUrl = await event.dataTransfer.getData("URL")
      await this.postMark(this.draggedUrl)
      await this.wait(1)
      this.isLoading = false
    },
    postMark(url) {
      this.quickAddBookmark(url)
    },
    fetchUrlFromClipboard() {
      const urlRegex = /^http(|s):\/\/.+/
      navigator.clipboard.readText()
          .then(text => {
            if (urlRegex.test(text)) {
              this.quickAddBookmark(text)
            } else {
              alert(`URLをクリップボードに追加してください\n入力された値:${text}`)
            }
          })
          .catch(err => {
            console.error('ユーザが拒否、もしくはなんらかの理由で失敗', err);
          });
    }
  },
  computed: {
    color() {
      return this.isEnter ? "blue darken-1" : "light-blue"
    }
  }
}
</script>

<style scoped>

</style>
