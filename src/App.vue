<template>
  <v-app>
    <v-navigation-drawer
        v-if="isLoginRequiredPage"
        :width="400"
        app
        permanent>
      <v-list-item link @click="toList">
        <v-list-item-content>
          <v-list-item-title class="title">
            BookMarker
          </v-list-item-title>
          <v-list-item-subtitle>
            book mark manager
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list
          dense
          nav
      >
        <v-list-item link @click="toCreate">
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>CREATE BOOKMARK</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider/>
        <v-list-item>
          <v-container>
            <quick-add></quick-add>
          </v-container>
        </v-list-item>
        <v-spacer/>
        <v-divider/>
        <v-list-item>
          <v-container>
            <v-btn block @click="logout">
              <v-icon>mdi-logout</v-icon>
              LOGOUT
            </v-btn>
          </v-container>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>


    <v-main><!-- アプリケーションに適切なgutterを提供します -->
      <v-container flud><!-- vue-routerを使用している場合 -->
        <router-view/>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import QuickAdd from "@/components/BookMark/QuickAdd";

export default {
  name: 'App',

  components: {
    QuickAdd,
  },
  methods: {
    toList() {
      if (this.$route.name !== "List") {
        this.$router.push({name: "List"})
      }
    },
    toCreate() {
      if (this.$route.name !== "Create") {
        this.$router.push({name: "Create"})
      }
    },
    async logout() {
      await localStorage.removeItem("token")
      await this.$router.push({name: "Login"})
    }
  },
  computed: {
    isLoginRequiredPage() {
      if (
          this.$route.name === "Login" ||
          this.$route.name === "Register"
      ) {
        return false
      }
      return true;
    }
  },
  data: () => ({}),
}
;
</script>

<style>
.hand {
  cursor: hand;
}

</style>
