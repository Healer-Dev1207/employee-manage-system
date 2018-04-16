<template>
  <div>
    <v-row>
      <v-col v-for="(item, i) in items" :key="i" cols=12 md=3>
        <v-card flat class="mt-3 pa-1" max-width="500">
          <v-row no-gutters>
            <v-col class="mt-2">
              <v-card-text>
                <v-icon class="pa-2" :style="{color: item.color, 'background-color': item.bg_color, 'border-radius': '23%'}">
                  {{item.icon}}
                </v-icon>
              </v-card-text>
            </v-col>
            <v-col class="pa-2 mr-10 mb-n5">
              <p class="caption appgrey--text">
                {{item.title}}
              </p>
              <h2 class="mt-n4">
              {{ item.data }}
              </h2>
              <p class="caption appgrey--text">
                {{item.add}}
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar"
      :timeout="4000"
      :color="snackbarColor"
      top
      elevation=0
      app
      >
      {{message}}
      <template v-slot:action="{ attrs }">
        <v-icon
        color="white"
        size=23
        v-bind="attrs"
        @click="snackbar = false">
            mdi-close-circle
        </v-icon>
      </template>
        
      </v-snackbar>
  </div>
</template>

<script>
export default {
    data() {
      return {
        isChanged: false,
        snackbar: false,
        snackbarColor: '#73cfa6',
        message: null,
        items: [
          { icon: 'mdi-chart-line', data: '₹0', title: 'Total Salary', add: '+0₹', color: '#73cfa6', bg_color: '#daf2e6'},
          { icon: 'mdi-chart-box-outline', data: '₹0', title: 'Total Advance', add: '+0₹', color: '#316cf5', bg_color: '#e0eaff'},
          {icon: 'mdi-book-check-outline', data: '00', title: 'Present Days', add: 'in this month', color: '#F3B076', bg_color: '#fcede3'}, 
          { icon: 'mdi-tshirt-crew-outline', data: '₹0', title: 'Total Work', add: '+0₹', color: '#d62f2f', bg_color: '#ffeaea'},
        ]
      }
    },

    async created() {
      try {
        let data = await this.$axios.$get('employee/home/cards')
        this.setItemsData(0, data.currentMonthSalary, data.salaryGrowth)
        this.setItemsData(1, data.currentMonthAdvance, data.advanceGrowth)
        this.setItemsData(3, data.currentMonthWork, data.workGrowth)
        this.items[2].data = data.presentDays < 10 ? '0' + data.presentDays : data.presentDays 
      } catch(err) {
        if(err.response){
          this.message = err.response.data.error
          this.snackbarColor = 'error'
          this.snackbar = true
        } else {
          console.log(err)
        }
      }
    },
    
    methods: {
      setItemsData(inx, data, add){
        let sign = add >= 0 ? '+' : null
        this.items[inx].data = '₹' + data
        this.items[inx].add = sign + add + '₹'
      }
    }
}
</script>
