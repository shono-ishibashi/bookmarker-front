<template>
  <v-card class="d-flex justify-start">
    <v-container>
      <v-row
          align="center"
          no-gutter
      >
        <v-col cols="10">
          <v-card
              link
              flat
              @click="openUrl(bookmark.url)"
          >
            <v-avatar
                size="20"
            >
              <v-img :src="fetchFavicon"></v-img>
            </v-avatar>
            {{ bookmark.title | truncate }}
          </v-card>
        </v-col>
        <v-col align-self="end" cols="2">
          <v-btn icon @click="toEdit(bookmark.id)">
            <v-icon color="blue">
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn icon @click="deleteBookmark(bookmark.id)">
            <v-icon color="red">
              mdi-delete
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import {mapActions} from "vuex"

export default {
  name: "Card",
  props: ['bookmark'],
  methods: {
    ...mapActions("bookmarks", ['deleteBookmark']),
    openUrl(url) {
      window.open(url)
    },
    toEdit(bookmark_id) {
      this.$router.push({name: 'Edit', query: {bookmarkId: bookmark_id}})
    }
  },
  computed: {
    fetchFavicon() {
      let url = this.bookmark.url
      let faviconUrl = "https://www.google.com/s2/favicons?domain=" + url
      return faviconUrl
    }
  },
  filters: {
    truncate: function (value) {
      var length = 100;
      var ommision = "...";
      if (value.length <= length) {
        return value;
      }
      return value.substring(0, length) + ommision;
    }
  },
}
</script>

<style scoped>

</style>
