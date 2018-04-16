<template>
  <div class="mt-3 pa-2">
    <v-snackbar
      v-model="snackbar"
      :timeout="4000"
      :color="snackbarColor"
      top
      >
      {{message}}
      <template v-slot:action="{ attrs }">
        <v-btn
        fab
        color="white"
        x-small
        v-bind="attrs"
        @click="snackbar = false"
        >
          <v-icon
          color="error"
          size=23>
              mdi-close-box
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-row justify='end'> 
      <v-col>
        <h2 class="textheadpurple--text"> Employees </h2>
      </v-col>
      
      <v-col class="mb-2">
        <div class="text-right">
          <popup @add-employee="addEmployee"></popup>
        </div>
      </v-col>
      <v-col class="ml-4 pt-1" lg="3" cols=12>
        <v-text-field label="Search by name" outlined dense class="mt-1" v-model="search"> </v-text-field>
      </v-col>
      
    </v-row>
    <v-divider class="mt-n5 mb-4"></v-divider>
    <v-row justify="start" align="center">
      <v-col v-for="(item, i) in resultQuery" :key="i" cols=12 md=4 sm=5>
        <v-card  max-width="320">
          
          <div class="text-center">
            <v-col class="pa-4 pt-8">
              <NuxtLink :to="`employees/${item.id}`" >
                <v-avatar
                  rounded
                  size="95"
                >
                <v-img
                  contain
                  :src="hostImageUrl + item.avatar"
                  >
                  </v-img>
                </v-avatar>
                <h3 class="mt-6 textheadpurple--text text-capitalize">{{item.name}}</h3>
              </NuxtLink>
              <h4 class="subtextgrey--text mt-1">{{formattedDate(item.date)}}</h4>
              <v-row class="mt-0" justify="center" align="center">
                
              </v-row>
              <h3 class="mt-4 mb-2 subtextgrey--text text-uppercase">{{item.desg}}</h3>
            </v-col>
          </div>
        </v-card>
      </v-col>
    </v-row>
    
  </div>
</template>

<script>
import popup from '../../components/popup.vue'
import moment from 'moment'
export default {
  middleware: 'auth',
  components: { popup },
  data() {
    return {
      message: null,
      snackbarColor: '#73cfa6',
      snackbar: false,
      hostImageUrl: process.env.HOST_IMAGE_URL,
      items: [],
      search: '',
    }
  },
  methods: {

    
    async addEmployee(e) {
      try {
        let data = await this.$axios.$post('admin/employees/add', {
          date: e.date,
          name: e.name,
          desg: e.desg,
          email: e.email,
          password: e.password
        })
        this.message = data.message
        this.snackbarColor = '#73cfa6'
        this.snackbar = true
      } catch(err) {
        if(err.response){
          this.snackbarColor = 'error'
          this.message = err.response.data.error
          this.snackbar = true
        }
      }
    },

    formattedDate(d){
      return d ? moment(d).format('DD MMM YYYY') : ''
    },
  },

  async created() {
    try {
      let data = await this.$axios.$get('admin/employees')
      for (let employee of data.employees) {
        let temp = {
          id: employee._id,
          name: employee.name,
          date: employee.date,
          desg: employee.desg,
          attendance: employee.attendance,
          avatar: employee.avatar ? employee.avatar.url : '/public/images/avatars/default.png'
        }
        this.items.push(temp)
      }
    } catch(err) {
      if(err.response){
        this.snackbarColor = 'error'
        this.message = err.response.data.error
        this.snackbar = true
      }
    }
  },

  computed: {
    resultQuery() {
      if(this.search) {
        return this.items.filter(item => {
          return this.search.toLowerCase().split(' ').every(v => item.name.toLowerCase().includes(v))
        })
      } else {
        return this.items
      }
    }
  }

  
}
</script>

<style  scoped>

</style>