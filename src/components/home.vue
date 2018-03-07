<template>
  <v-container>
    <v-layout row>
      <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
      <v-flex v-if="!loading" xs12 sm6 offset-sm3>
        <v-card>
          <v-list two-line>
            <v-subheader>
              <h1>Companies</h1>
              <v-spacer></v-spacer>
              <v-btn @click.stop="dialogAddCompany = true" v-if="userIsAuthenticated">Add +</v-btn>
            </v-subheader>
            <template v-for="company in companies">
              <v-list-tile :key="company.id" @click="onLoadCompany(company.id)">
                <v-list-tile-avatar>
                  <img :src="company.imageUrl"/>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{company.name}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{company.desc}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
      <v-dialog v-model="dialogAddCompany" max-width="500px">
        <v-card>
          <v-card-title>
            Add Company
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="intCompanyName" label="Company Name"></v-text-field>
            <v-text-field v-model="intCompanyDesc" label="Company Description"></v-text-field>
            <!-- <v-text-field v-model="intCompanyImageUrl" label="Company Image"></v-text-field> -->
            <v-btn raised class="primary" @click="onPickFile">Upload Image</v-btn>
            <input
              type="file"
              style="display:none"
              ref="fileInput"
              accept="image/*"
              @change="onFilePicked">
            <v-card-media>
              <img height="200" width="100%" :src="intCompanyImageUrl" alt="">
            </v-card-media>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="warning" @click="dialogAddCompany = false">Close</v-btn>
            <v-btn color="success" @click="addCompany">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
// if (window.navigator.onLine) {
//   alert('online')
// } else {
//   alert('offline')
// }
export default {
  data () {
    return {
      dialogAddCompany: false,
      intCompanyName: '',
      intCompanyDesc: '',
      intCompanyImageUrl: '',
      image: null
    }
  },
  computed: {
    companies () {
      return this.$store.getters.companies
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onLoadCompany (id) {
      this.$router.push('/detail/' + id)
    },
    addCompany () {
      this.dialogAddCompany = false
      const company = {
        name: this.intCompanyName,
        desc: this.intCompanyDesc,
        image: this.image
      }
      this.$store.dispatch('addCompany', company)
      this.intCompanyName = ''
      this.intCompanyDesc = ''
      this.intCompanyImageUrl = ''
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onFilePicked (event) {
      const files = event.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Please add a valid file!')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.intCompanyImageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    }
  }
}
</script>