<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-list two-line>
            <v-subheader>Companies</v-subheader>
            <template v-for="company in companies">
              <v-list-tile :key="company.id" @click="onLoadCompany(company.id)">
                <v-list-tile-avatar>
                  <img :src="company.avatar"/>
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
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      companies: [
        {id: '123', avatar: 'https://upload.wikimedia.org/wikipedia/id/d/d5/Aang_.jpg', name: 'PT ABC', desc: 'The best companieA'},
        {id: '133', avatar: 'https://upload.wikimedia.org/wikipedia/id/d/d5/Aang_.jpg', name: 'PT DEF', desc: 'The best companieB'},
        {id: '211', avatar: 'https://upload.wikimedia.org/wikipedia/id/d/d5/Aang_.jpg', name: 'PT GHI', desc: 'The best companieC'}
      ]
    }
  },
  methods: {
    onLoadCompany (id) {
      alert(id)
    }
  }
}
</script>

