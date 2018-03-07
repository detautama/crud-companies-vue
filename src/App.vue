<template>
  <v-app>
    <v-toolbar dark class="mb-5">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-lg-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link tag="span" style="cursor:pointer" to="/">Companies CRUD</router-link>
        </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn @click="opDialSignup = true" v-if="!userIsAuthenticated" flat>Sign Up</v-btn>
        <v-btn @click="opDialSignin = true" v-if="!userIsAuthenticated" flat>Sign In</v-btn>
        <v-btn  v-if="userIsAuthenticated" @click="logout" flat>Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-navigation-drawer temporary v-model="drawer" absolute>
      <!-- <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg" >
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>John Leider</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list> -->
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile v-if="!userIsAuthenticated" @click="opDialSignup = true">
          <v-list-tile-action>
            <v-icon>info</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Sign Up
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="!userIsAuthenticated" @click="opDialSignin = true">
          <v-list-tile-action>
            <v-icon>info</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Sign In
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="userIsAuthenticated" @click="logout">
          <v-list-tile-action>
            <v-icon>info</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Sign Out
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-dialog v-model="opDialSignin" v-if="!userIsAuthenticated" max-width="500px">
      <v-alert type="error" v-if="error" value="error">
        Email atau Password Salah
      </v-alert>
      <v-card>
        <v-card-title>Sign In</v-card-title>
        <v-card-text>
          <v-text-field v-model="email" label="Email" type="email"></v-text-field>
          <v-text-field v-model="password" label="Password" type="password"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="info" @click="onSignin">Signin</v-btn>
          <v-btn class="warning" @click="opDialSignin = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="opDialSignup" v-if="!userIsAuthenticated" max-width="500px">
      <v-alert type="error" v-if="error" value="error">
        {{errorStatus}}
      </v-alert>
      <v-card>
        <v-card-title>Sign Up</v-card-title>
        <v-card-text>
          <v-text-field v-model="email" label="Email" type="email"></v-text-field>
          <v-text-field v-model="password" label="Password" type="password"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="info" @click="onSignup">Signup</v-btn>
          <v-btn class="warning" @click="opDialSignup = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      opDialSignup: false,
      opDialSignin: false,
      drawer: null,
      email: '',
      password: ''
    }
  },
  computed: {
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
    error () {
      return this.$store.getters.error !== null && this.$store.getters.error !== undefined
    },
    errorStatus () {
      const msg = this.$store.getters.error
      if (msg.message === 'The email address is already in use by another account.') {
        return 'Email telah digunakan'
      } else if (msg.message === 'Password should be at least 6 characters') {
        return 'Password harus lebih dari 6 karakter'
      }
      return msg.message
    }
  },
  methods: {
    onSignup () {
      const user = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('onSignup', user)
    },
    onSignin () {
      const user = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('onSignin', user)
    },
    logout () {
      this.$store.dispatch('logout')
      this.email = ''
      this.password = ''
    }
  }
}
</script>
