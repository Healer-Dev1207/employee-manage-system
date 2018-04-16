<template>
    <div>
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
    <v-row>
      <v-col v-for="(item, i) in items" :key="i" cols=12 sm=6 md=3>
        <v-card outlined class="mt-3" color="mainpurple">
            <v-card-title class="white--text">
            {{ item.title }}
            </v-card-title>
            <v-divider class="mx-2" :dark=true></v-divider>
            <v-card-text>
                <v-row align="center" justify="start" align-content="start">
                    <v-icon color="white" size="40" class="mt-1">{{item.icon}}</v-icon>
                    <h1 class="px-2 pl-2 mt-2 text-h3 font-weight-medium white--text">
                      <div  v-if="item.data">
                        {{item.data}}
                      </div>
                      <div v-else>
                        00
                      </div>
                    </h1>
                    <h1 class="mt-2 text-h6 font-weight-light white--text">{{item.subtext}}</h1>
                </v-row>
            </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    </div>
</template>

<script>

export default {
  // DONE: Instead of Salary and Advance sort by categories
  data(){
    return {
      message: null,
      snackbarColor: null,
      snackbar: false,
      totEmps: '00',
      items: [
        { title: 'Total Employees', icon: 'mdi-account-outline', data: null, subtext: 'Employees' },
        { title: 'Total Work of Month', icon: 'mdi-tshirt-crew-outline', data: null, subtext: 'Products' },
        { title: 'Total Advance of month', icon: 'mdi-credit-card-outline', data: null, subtext: 'Rs.' },
        { title: 'Total Salary of month', icon: 'mdi-credit-card-outline', data: null, subtext: 'Rs.' },
      ]
    }
  },
  
  async created() {
    try {
      // get total employees
      let data = await this.$axios.$get('admin/employees')
      this.items[0].data = data.employees.length < 10 ? '0' + data.employees.length  : data.employees.length

      // Get Works by Mont
      data = await this.$axios.$get('admin/work')
      let totWork = 0
      if(data.works.length >= 1){
        data.works.forEach(d => {
          if(this.$moment(d.date).format('YYYY-MM') == this.$moment().format('YYYY-MM')){
            totWork += d.quantity
          }
        })
        this.items[1].data = totWork < 10 ? '0' + totWork  : totWork
      }

      // Get salary and Advance
      let totSal = 0
      let totAdv = 0
      let temp = await this.$axios.$get('admin/salary')
      if(temp.salaries.length >= 1){
        temp.salaries.forEach(s => {
          if(this.$moment(s.month).format('YYYY-MM') == this.$moment().format('YYYY-MM')){
            if(s.type.toLowerCase() === 'salary'){
              totSal += s.salary
            } else {
              totAdv += s.salary
            }
          }
        })
        this.items[2].data = totAdv < 10 ? '0' + totAdv : totAdv
        this.items[3].data = totSal < 10 ? '0' + totSal  : totSal
      }
    } catch(err) {
      if(err.response){
        this.snackbarColor = 'error'
        this.message = err.response.data.error
        this.snackbar = true
      }
    }
  },
}
</script>
