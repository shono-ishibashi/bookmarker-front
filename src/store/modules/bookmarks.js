import axios from "axios";
import qs from "qs";

export default {
  namespaced: true,
  state: {
    bookmarks: []
  },

  mutations: {
    addBookmark(state, bookmark) {
      state.bookmarks.push(bookmark);
    },
    resetBookmarks(state) {
      state.bookmarks.splice(0, state.bookmarks.length);
    },
    deleteBookmark(state, bookmark_id) {
      let bookmark_index = state.bookmarks.findIndex(bookmark => bookmark.id === bookmark_id);
      state.bookmarks.splice(bookmark_index, 1)
    },
    updateBookmark(state, bookmark) {
      let targetBookmark = state.bookmarks.find(stateBookmark => stateBookmark.id === bookmark.id)
      Object.assign(targetBookmark, bookmark)
    },
  },

  actions: {
    async fetchBookmarks({commit, state}, searchWords) {
      let token = await localStorage.getItem('token')
      await axios.get("/bookmark/", {
        params: {
          "search_words": searchWords
        },
        headers: {
          "Authorization": token
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      }).then((bookmarks) => {
        for (let bookmark of bookmarks.data) {
          if (state.bookmarks.findIndex(state_bookmark => state_bookmark.id === bookmark.id) === -1) {
            commit("addBookmark", bookmark)
          }
        }
      })
    },
    async fetchBookmark({commit, state}, bookmark_id) {
      let token = await localStorage.getItem('token')
      await axios.get(`/bookmark/${bookmark_id}`, {
        headers: {
          "Authorization": token
        }
      }).then(({data}) => {
        if (state.bookmarks.findIndex(state_bookmark => state_bookmark.id === data.id) === -1) {
          commit("addBookmark", data)
        }
      }).catch(() => {
      })
    },
    postBookmark({commit}, bookmark) {
      let token = localStorage.getItem('token')
      axios.post("/bookmark/", bookmark, {
        headers: {
          "Authorization": token
        }
      }).then(({data}) => {
        commit("addBookmark", data)
      })
    },
    async updateBookmark({commit}, {bookmark: bookmark, bookmarkId: bookmarkId}) {
      let token = localStorage.getItem('token')
      await axios.put(`/bookmark/${bookmarkId}`, bookmark, {
        headers: {
          "Authorization": token
        }
      }).then(() => {
        bookmark.id = bookmarkId
        commit("updateBookmark", bookmark)
      })
    },
    quickAddBookmark({commit}, url) {
      let token = localStorage.getItem("token")
      axios.post("/bookmark/quickadd?url=" + url, {}, {
        headers: {
          "Authorization": token
        }
      })
        .then(({data}) => {
          commit("addBookmark", data)
        })
    },
    deleteBookmark({commit}, bookmark_id) {
      console.log(bookmark_id)
      let token = localStorage.getItem("token")
      axios.delete(`/bookmark/${bookmark_id}`, {
        headers: {
          "Authorization": token
        }
      })
        .then(() => {
          commit("deleteBookmark", bookmark_id)
        })
    }
  },

  getters: {
    bookmarks(state) {
      return state.bookmarks
    }
  }

}
