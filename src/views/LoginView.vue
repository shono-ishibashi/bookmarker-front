<template>
  <v-container>
    <v-card class="elevation-1 pa-3 login-card">
      <v-row justify="center" align-content="center">
        <v-col cols="10">
          <v-card-text>
            <div class="layout column align-center">
              <h1 class="flex my-4 primary--text font-weight-bold">ログイン</h1>
            </div>
            <v-alert
                v-if="login_alert"
                border="left"
                color="red"
                dark
            >{{ alert_message }}
            </v-alert>
            <v-form ref="loginForm" @submit.prevent="login">
              <v-text-field
                  name="login"
                  label="メールアドレス"
                  type="email"
                  v-model="loginData.email"
                  :counter="128"
                  :rules="emailRules"
                  required
              ></v-text-field>
              <v-text-field
                  name="password"
                  label="パスワード"
                  id="password"
                  type="password"
                  v-model="loginData.password"
                  :counter="32"
                  :rules="passwordRules"
                  required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <div class="login-form-btn">
            <v-btn block color="primary" @click="login" :loading="loading">ログイン</v-btn>
          </div>
          <div class="login-form-btn">
            <v-btn block color="light-blue lighten-5" @click="$router.push({name: 'Register'})">ユーザー登録はこちら</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios"

export default {
  name: "LoginView",
  data: () => ({
    loading: false,
    emailRules: [
      v => !!v || "メールアドレスは必須項目です。",
      v => (v && v.length <= 128) || "メールアドレスは128文字以内で入力してください。",
      v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "メールアドレスの形式が正しくありません。"
    ],
    passwordRules: [
      v => !!v || "パスワードは必須項目です。",
      v => (v && v.length <= 32) || "パスワードは32文字以内で入力してください。"
    ],
    loginData: {
      email: "",
      password: ""
    },
    login_alert: false,
    alert_message: ""
  }),

  methods: {
    login() {
      if (this.$refs.loginForm.validate()) {
        this.login_alert = false
        let param = new URLSearchParams()
        param.append("username", this.loginData.email)
        param.append("password", this.loginData.password)
        axios.post("/auth/jwt/login", param
        ).then(async ({data}) => {
          this.loading = true;
          let token = data.token_type + " " + data.access_token;
          await localStorage.setItem("token", token)
          await this.$router.push({name: "List"})
        }).catch(async (error) => {
          if (error.response.status === 400) {
            const alert_message = "メールアドレスもしくはパスワードが間違っています"
            await this.displayErrorMessage(alert_message)
          } else {
            const alert_message = "時間をおいて再度お試しください"
            await this.displayErrorMessage(alert_message)
          }
        }).finally(() => {
          console.log('finally')
          this.loading = false
        })
      }
    },
    displayErrorMessage(message) {
      this.login_alert = true;
      this.alert_message = message;
    }
  }
}
</script>

<style scoped>
.login-form-btn {
  margin-bottom: 20px;
}

</style>
