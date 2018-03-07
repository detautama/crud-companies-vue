import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import * as firebase from 'firebase'

Vue.use(Vuex, router)

export const store = new Vuex.Store({
  state: {
    loadedCompanies: [
      {
        id: '123',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/id/d/d5/Aang_.jpg',
        name: 'PT ABC',
        desc: 'The best companieA'
      },
      {
        id: '133',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/id/d/d5/Aang_.jpg',
        name: 'PT DEF',
        desc: 'The best companieB'
      },
      {
        id: '211',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/id/d/d5/Aang_.jpg',
        name: 'PT GHI',
        desc: 'The best companieC'
      }
    ],
    user: null,
    error: null,
    loading: ''
  },
  mutations: {
    setLoadedCompanies (state, payload) {
      state.loadedCompanies = payload
    },
    addedCompany (state, payload) {
      state.loadedCompanies.push(payload)
    },
    deletedCompany (state, payload) {
      var array = state.loadedCompanies
      var index = array.map((item) => { return item.id }).indexOf(payload.id)
      console.log(index)
      state.loadedCompanies.splice(index, 1)
      router.push('/')
    },
    updatedCompany (state, payload) {
      var array = state.loadedCompanies
      var index = array.map((item) => { return item.id }).indexOf(payload.id)
      console.log(index)
      array[index].name = payload.name
      array[index].desc = payload.desc
      array[index].imageUrl = payload.imageUrl
      array[index].namaFile = payload.namaFile
    },
    setUser (state, payload) {
      state.user = payload
      console.log('di mutation setUser ==' + payload)
    },
    setError (state, payload) {
      state.error = payload
    },
    setLoading (state, payload) {
      state.loading = payload.status
    }
  },
  actions: {
    loadCompanies ({commit}) {
      commit('setLoading', {status: true})
      firebase.database().ref('companies').once('value')
        .then((data) => {
          const companies = []
          const obj = data.val()
          for (let key in obj) {
            companies.push({
              id: key,
              name: obj[key].name,
              desc: obj[key].desc,
              imageUrl: obj[key].imageUrl,
              creatorId: obj[key].creatorId,
              namaFile: obj[key].namaFile
            })
          }
          commit('setLoadedCompanies', companies)
          commit('setLoading', {status: false})
        })
        .catch((error) => {
          console.log('error' + error)
        })
    },
    addCompany ({commit, getters}, payload) {
      commit('setLoading', {status: true})
      const company = {
        name: payload.name,
        desc: payload.desc,
        creatorId: getters.user.id
      }
      let imageUrl
      let key
      let namaFile
      let ext
      firebase.database().ref('companies').push(company)
        .then((data) => {
          key = data.key
          return key
        })
        .then(key => {
          const fileName = payload.image.name
          ext = fileName.slice(fileName.lastIndexOf('.'))
          return firebase.storage().ref('companies/' + key + ext).put(payload.image)
        })
        .then(fileData => {
          imageUrl = fileData.metadata.downloadURLs[0]
          namaFile = key + ext
          return firebase.database().ref('companies').child(key).update({imageUrl: imageUrl, namaFile: namaFile})
        })
        .then(() => {
          commit('addedCompany', {
            ...company,
            imageUrl: imageUrl,
            namaFile: namaFile,
            id: key
          })
          commit('setLoading', {status: false})
        })
        .catch((error) => {
          console.log(error)
        })
    },
    delCompany ({commit, getters}, payload) {
      commit('setLoading', {status: true})
      const company = {
        id: payload.id,
        namaFile: payload.namaFile
      }
      firebase.storage().ref('companies/' + company.namaFile).delete()
        .then(() => {
          firebase.database().ref('companies/' + company.id).remove()
            .then(() => {
              console.log('Document successfully deleted!')
              commit('deletedCompany', company)
              commit('setLoading', {status: false})
            }).catch((error) => {
              console.log(error)
            })
        })
        .catch((error) => {
          console.log(error)
          commit('setLoading', {status: false})
        })
    },
    updCompany ({commit}, payload) {
      commit('setLoading', {status: true})
      let imageUrl
      let namaFile
      let ext
      firebase.storage().ref('companies/' + payload.namaFile).delete()
        .then(() => {
          const fileName = payload.image.name
          ext = fileName.slice(fileName.lastIndexOf('.'))
          return firebase.storage().ref('companies/' + payload.id + ext).put(payload.image)
        })
        .then(fileData => {
          imageUrl = fileData.metadata.downloadURLs[0]
          namaFile = payload.id + ext
          return firebase.database().ref('companies').child(payload.id).update({imageUrl: imageUrl, namaFile: namaFile})
        })
        .then(() => {
          const company = {
            id: payload.id,
            name: payload.name,
            desc: payload.desc,
            imageUrl: imageUrl,
            namaFile: namaFile
          }
          firebase.database().ref('companies/' + payload.id).update(company)
            .then((data) => {
              commit('updatedCompany', company)
              commit('setLoading', {status: false})
            })
            .catch((error) => {
              console.log(error)
              commit('setLoading', {status: false})
            })
        })
        .catch((error) => {
          console.log(error)
          commit('setLoading', {status: false})
        })
    },
    onSignup ({commit}, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = {
              id: user.uid
            }
            commit('setUser', newUser)
            commit('setError', null)
            router.push('/')
          }
        )
        .catch(
          error => {
            commit('setError', error)
          }
        )
    },
    onSignin ({commit}, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = {
              id: user.uid
            }
            commit('setUser', newUser)
            commit('setError', null)
            router.push('/')
          }
        )
        .catch(error => {
          commit('setError', error)
        })
    },
    autoSignin ({commit}, payload) {
      commit('setUser', {id: payload.uid})
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    companies (state) {
      return state.loadedCompanies
    },
    company (state) {
      return (companyId) => {
        return state.loadedCompanies.find((element) => {
          return element.id === companyId
        })
      }
    },
    user (state) {
      return state.user
    },
    error (state) {
      return state.error
    },
    loading (state) {
      return state.loading
    }
  }
})
