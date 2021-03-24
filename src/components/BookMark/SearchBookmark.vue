<template>
  <div>
    <v-container>
      <v-form @submit.prevent="searchBookmarks">
        <v-text-field
            :hint="searchBoxHint"
            :placeholder="searchBoxPlaceholder"
            v-model="inputWords"
            clearable
            prepend-inner-icon="mdi-magnify"
        />
      </v-form>
    </v-container>
  </div>
</template>

<script>
import {mapActions, mapMutations} from "vuex"

export default {
  name: "SearchBookmark",
  data: () => {
    return {
      searchWords: [],
      inputWords: "",
      searchBoxHint: "検索したいtag,memo,titleの内容を入力してEnterを押してください",
      searchBoxPlaceholder: "ex) python django   +[Enter]",
      searchLoading: false
    }
  },
  methods: {
    ...mapActions("bookmarks", ["fetchBookmarks"]),
    ...mapMutations("bookmarks", ["resetBookmarks"]),
    splitWords() {
      if (this.inputWords) {
        this.searchWords = []
        for (let word of this.inputWords.split(' ')) {
          if (word) {
            this.searchWords.push(word)
          }
        }
        this.$store.dispatch("bookmarks/fetchBookmarks", this.searchWords)
      }
    },
    async searchBookmarks() {
      this.searchLoading = await true
      await this.resetBookmarks()
      await this.splitWords()
      if (this.inputWords) {
        await this.fetchBookmarks(this.searchWords)
      } else {
        await this.fetchBookmarks([])
      }
      this.searchLoading = false
    },
  },
  watch: {
    inputWords() {
      if (!this.inputWords) {
        this.fetchBookmarks([])
      }
    },
    searchLoading() {
      this.$emit("searchLoading", this.searchLoading);
    }
  }
}
</script>

<style scoped>

</style>
