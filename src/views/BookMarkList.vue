<template>
  <div>
    <SearchBookmark @searchLoading="toggleSearchLoading"/>
    <div v-if="!searchLoading">
      <BookMarkCard
          v-for="bookmark in bookmarks "
          :bookmark="bookmark"
          :key="bookmark.id"
          class="bookmark-card"
      ></BookMarkCard>
    </div>
    <v-alert
        v-if="bookmarks.length === 0 && !searchLoading"
        border="left"
        color="blue"
        dark
    >ブックマークはありません
    </v-alert>
    <vue-loading
        type="spin"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
        v-if="searchLoading"/>
    <import-from-chrome-bookmarks/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex"
import BookMarkCard from "@/components/BookMark/BookMarkCard";
import SearchBookmark from "@/components/BookMark/SearchBookmark";
import {VueLoading} from 'vue-loading-template'
import ImportFromChromeBookmarks from "@/components/BookMark/ImportFromChromeBookmarks";

export default {
  name: "BookMarkList",
  data: () => {
    return {
      isEnter: false,
      files: [],
      searchLoading: false
    }
  },
  components: {
    SearchBookmark,
    BookMarkCard,
    VueLoading,
    ImportFromChromeBookmarks
  },
  computed: {
    ...mapGetters("bookmarks", ["bookmarks"])
  },
  methods: {
    ...mapActions("bookmarks", ["fetchBookmarks"]),
    toggleSearchLoading(value) {
      this.searchLoading = value
    }

  },
  async created() {
    this.searchLoading = true
    await this.fetchBookmarks()
    this.searchLoading = false
  }
}
</script>

<style scoped>
.bookmark-card {
  margin-bottom: 5px;
}

</style>
