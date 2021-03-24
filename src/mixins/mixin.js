import axios from "axios";

export default {
  data() {
    return {
      url_info: null
    }
  },
  computed: {},
  methods: {
    fetchUrlData(url) {
      axios.get("/url_util/", {
        params: {
          url: url
        }
      })
        .then(({data}) => {
            return data
          }
        ).catch(() => {
        return false
      })
    },
    sleepByPromise(sec) {
      return new Promise(resolve => setTimeout(resolve, sec * 1000));
    },
    async wait(sec) {
      await this.sleepByPromise(sec);
    }
  }
}
