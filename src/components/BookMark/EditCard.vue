<script src="../../store/modules/bookmarks.js"></script>
<template>
  <div>
    <v-card-title>Edit</v-card-title>
    <v-form v-if="!notFound" ref="form">
      <v-text-field
          :rules="rules.titleRules"
          label="TITLE"
          :loading="titleLoading"
          :disabled="titleLoading"
          v-model="updateBookmarkModel.title"
          placeholder="urlを入力すると自動で入力されます"
      ></v-text-field>
      <v-text-field
          label="URL"
          :rules="rules.urlRules"
          v-model="updateBookmarkModel.url"
          @change="fetchSiteTitle(updateBookmarkModel.url)"
      ></v-text-field>
      <v-combobox
          label="tags"
          v-model="updateBookmarkModel.tags"
          chips
          multiple
      >
      </v-combobox>
      <v-textarea
          label="memo"
          v-model="updateBookmarkModel.memo"
      ></v-textarea>
      <v-btn @click="submitForm">submit!</v-btn>
    </v-form>
    <v-alert
        v-if="notFound"
        border="left"
        color="blue"
        dark
    >ブックマークはありません
    </v-alert>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex"
import axios from "axios";

export default {
  name: "EditCard",
  data: () => {
    return {
      updateBookmarkModel: {
        title: "",
        url: "",
        tags: [],
        memo: ""
      },
      defaultBookmarkModel: {
        title: "",
        url: "",
        tags: [],
        memo: ""
      },
      rules: {
        titleRules: [
          v => !!v || 'Title is required',
        ],
        urlRules: [
          v => !!v || 'URL is required',
          v => /^http(|s):\/\/.+/.test(v) || 'URL must be valid',
        ],
      },
      notFound: false,
      titleLoading: false
    }
  },
  computed: {
    ...mapGetters("bookmarks", ["bookmarks"]),
  },
  async created() {
    let bookmarkId = await this.$route.query.bookmarkId
    if (!bookmarkId) {
      bookmarkId = null
    }
    if (bookmarkId) {
      await this.fetchBookmark(bookmarkId)
      let targetBookmark = await this.bookmarks.find(({id}) =>
          id === bookmarkId
      )
      if (targetBookmark) {
        this.notFound = false
        await Object.assign(
            this.updateBookmarkModel,
            targetBookmark)
      } else {
        this.notFound = true
      }
    } else {
      this.notFound = true
    }
  },
  methods: {
    ...mapActions("bookmarks", ["fetchBookmark", "postBookmark", "updateBookmark"]),
    async fetchSiteTitle(url) {
      this.titleLoading = await true
      let token = localStorage.getItem('token')
      await axios.get(`/url-info/?url=${url}`, {
        headers: {
          Authorization: token
        }
      })
          .then(({data}) => {
            if (data) {
              this.updateBookmarkModel.title = data.title
            } else {
              alert("タイトルを取得できませんでした")
            }
          }).catch(() => {
            this.titleLoading = false
            this.updateBookmarkModel.title = ""
            alert("タイトルを取得できませんでした")
          })
      this.titleLoading = await false
    },

    async submitForm() {
      if (this.$refs.form.validate()) {
        let bookmarkId = await this.$route.query.bookmarkId
        await this.updateBookmark(
            {
              bookmark: this.updateBookmarkModel,
              bookmarkId: bookmarkId
            })
        await this.$router.push({name: 'List'})
      }
    }
  }
}
</script>

<style scoped>

</style>
