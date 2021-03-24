<template>
  <div>
    <v-file-input
        accept="text/html"
        @change="onFileChange"
    >
    </v-file-input>

  </div>
</template>

<script>
export default {
  name: "ImportFromChromeBookmarks",
  data() {
    return {
      file: null,
      createImage: null,
    }
  },
  methods:{
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.createImage(files[0]);
    },

  },
  watch:{
    file(){
      console.log(this.file)
    }
  }
}
</script>

<style scoped>

</style>
