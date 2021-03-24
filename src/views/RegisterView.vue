<template>
  <v-container>
    <v-card class="elevation-1 pa-3 login-card">
      <v-row justify="center" align-content="center">
        <v-col cols="10">
          <v-card-text>
            <div class="layout column align-center">
              <h1 class="flex my-4 primary--text font-weight-bold">ユーザー登録</h1>
            </div>
            <v-alert
                v-if="register_alert"
                border="left"
                color="red"
                dark
            >{{ alert_message }}
            </v-alert>
            <v-form ref="loginForm" @submit.prevent="register">
              <v-text-field
                  name="login"
                  label="メールアドレス"
                  type="email"
                  v-model="registerData.email"
                  :counter="128"
                  :rules="emailRules"
                  required
              ></v-text-field>
              <v-text-field
                  name="password"
                  label="パスワード"
                  id="password"
                  type="password"
                  v-model="registerData.password"
                  :counter="32"
                  :rules="passwordRules"
                  required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <div class="login-form-btn">
            <v-btn block color="primary" @click="register" :loading="loading">登録</v-btn>
          </div>
          <div class="login-form-btn">
            <v-btn block color="light-blue lighten-5" @click="$router.push({name:'Login'})">ログインはこちら</v-btn>
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
    registerData: {
      email: "",
      password: ""
    },
    register_alert: false,
    alert_message: ""
  }),

  methods: {
    register() {
      if (this.$refs.loginForm.validate()) {
        this.register_alert = false
        let data = {
          "email": this.registerData.email,
          "password": this.registerData.password
        }
        axios.post("/auth/register", data
        ).then(async ({data}) => {
          this.loading = true;
          let token = data.token_type + " " + data.access_token;
          await localStorage.setItem("token", token)
          await this.$router.push({name: "List"})
          await this.$router.push({name: "Login"})
        }).catch(async (error) => {
          if (error.response.status === 400) {
            let alert_message = ""
            if (error.response.data.detail === "REGISTER_USER_ALREADY_EXISTS") {
              alert_message = "入力されたメールアドレスは既に使用されています。"
            } else {
              alert_message = "正しい値を入力してください"
            }
            await this.displayErrorMessage(alert_message)
          } else {
            const alert_message = "時間をおいて再度お試しください"
            await this.displayErrorMessage(alert_message)
          }
        }).finally(() => {
          this.loading = false
        })
      }
    },
    displayErrorMessage(message) {
      this.register_alert = true;
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
