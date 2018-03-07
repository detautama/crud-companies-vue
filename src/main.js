import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store'
import * as firebase from 'firebase'

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyBFe7SZYk07wfohdT84f0xFhX5w_VO1zkY',
      authDomain: 'crud-companies.firebaseapp.com',
      databaseURL: 'https://crud-companies.firebaseio.com',
      projectId: 'crud-companies',
      storageBucket: 'gs://crud-companies.appspot.com',
      messagingSenderId: '256794118193'
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignin', user)
      }
    })
    this.$store.dispatch('loadCompanies')
  }
})
