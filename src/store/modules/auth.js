import axios from "axios";

export default {
  namespaced: true,
  state: {
    bookmarks: [
      {
        id: 1,
        name: "aaa"
      }
    ]
  },

  mutations: {
    addBookmark(state, bookmark) {
      state.bookmarks.push(bookmark);
    },
    resetBookmarks(state) {
      state.bookmarks.splice(0, state.bookmarks.length);
    },
    // deleteBookmark(state, bookmark_id) {
    //   let bookmark_index = state.bookmarks.findIndex(bookmark => bookmark.id === bookmark_id);
    //   state.bookmarks.splice(bookmark_index, 1)
    // },
  },

  actions: {
    fetchBookmarks({commit}) {
      console.log('hey')
      axios.get("/bookmark/", {
        headers: {
          "Authorization": "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNGMxNzIwNTctNTM5Mi00NjBmLThhNTctNTIxNzg4ZDE2NDJkIiwiYXVkIjoiZmFzdGFwaS11c2VyczphdXRoIiwiZXhwIjoyNjEyMTQ5NDU4fQ.34ipjn3Id6HU4-oMYZIllL3yUb0yLElaZSN1XCap58k"
        }
      }).then((bookmarks) => {
        for (let bookmark of bookmarks.data) {
          commit("addBookmark", bookmark)
        }
      })
    }
  },

  getters: {}

}
