<template>
  <v-container>
    <v-layout row>
      <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
      <v-flex v-if="!loading" xs12 sm6 offset-sm3>
        <v-card>
        <v-card-media>
          <img height="200" :src="company.imageUrl" alt="">
        </v-card-media>
        <v-card-title>
          <h3>{{company.name}}</h3>
        </v-card-title>
        <v-card-text>
          {{company.desc}}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogDel = true" class="warning">Delete</v-btn>
          <v-btn @click="dialogUpd = true" class="info">Edit</v-btn>
        </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialogUpd" max-width="500px">
      <v-card>
        <v-card-title>Update Company</v-card-title>
        <v-card-text>
          <v-text-field label="Company Name" v-model="name = company.name"></v-text-field>
          <v-text-field label="Company Description" v-model="desc = company.desc"></v-text-field>
          <img v-if="showOldImage" width="100%" :src="company.imageUrl">
          <v-btn raised class="primary" @click="onPickFile">Change Image</v-btn>
            <input
              type="file"
              style="display:none"
              ref="fileInput"
              accept="image/*"
              @change="onFilePicked">
            <v-card-media>
              <img width="100%" :src="intCompanyImageUrl" alt="">
            </v-card-media>
          {{company.namaFile}}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="updCompany(id, company.namaFile)">Save</v-btn>
          <v-btn @click="dialogUpd = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDel" max-width="500px">
      <v-card>
        <v-card-title>Delete</v-card-title>
        <v-card-text>Are you sure ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="delCompany(id, company.namaFile)">Yes</v-btn>
          <v-btn @click="dialogDel = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  props: ['id'],
  data () {
    return {
      dialogDel: false,
      dialogUpd: false,
      name: '',
      desc: '',
      imageUrl: null,
      intCompanyImageUrl: '',
      showOldImage: true
    }
  },
  methods: {
    delCompany (vCompanyId, namaFile) {
      const companyId = {
        id: vCompanyId,
        namaFile: namaFile
      }
      this.$store.dispatch('delCompany', companyId)
    },
    updCompany (vCompanyId, namaFile) {
      const company = {
        id: vCompanyId,
        name: this.name,
        desc: this.desc,
        image: this.image,
        namaFile: namaFile
      }
      this.$store.dispatch('updCompany', company)
      this.dialogUpd = false
    },
    onPickFile () {
      this.showOldImage = false
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
  },
  computed: {
    company () {
      return this.$store.getters.company(this.id)
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

