import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from "axios";

import LoginView from '../views/LoginView'
import BookMarkList from "@/views/BookMarkList";
import EditBookMark from "@/views/EditBookMark";
import CreateBookMark from "@/views/CreateBookMark";
import RegisterView from "@/views/RegisterView";


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/',
    name: 'List',
    component: BookMarkList
  },
  {
    path: '/edit',
    name: 'Edit',
    component: EditBookMark
  },
  {
    path: '/create',
    name: 'Create',
    component: CreateBookMark
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach(async (to, from, next) => {
  let token = await localStorage.getItem('token')
  if (to.name === "Login" || to.name === "Register") {
    next()
  } else {
    if (token == null) {
      next({name: "Login"})
    } else {
      await axios.get('/bookmark/', {
        headers: {
          Authorization: token
        }
      })
        .then(() => {
          next()
        })
        .catch(() => {
          next({name: "Login"})
        })
    }
  }
})

export default router
