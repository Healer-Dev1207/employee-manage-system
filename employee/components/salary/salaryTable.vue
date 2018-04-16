<template>
  <div class="mt-8 pa-2">
    <v-row align-content="space-between" justify="space-between" class="pl-4">
      <v-col cols=3 md=8>
        <h3>My Salaries</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col md=1 cols=5 class="pl-4 mt-3">
        <v-row>
        <v-menu offset-y >
            <template v-slot:activator="{ on, attrs }">
            <p
            v-bind="attrs" 
            v-on="on"
            class="appgrey--text"
            >
            <span v-if="month">{{$moment(month).format('MMM \'YY')}}</span>
            <span v-else>Filter</span>
            
              <v-icon
              color="appgrey"
              >
              mdi-chevron-down
              </v-icon>
            </p>
            </template>
            <v-date-picker
            v-model="month"
            type="month"
            color="appmainblue"
            elevation="0"
            min="2021-01"
            ></v-date-picker>
          </v-menu>
          <v-icon
          color="appgrey"
          size=20
          v-if="month"
          @click="month=null"
          class="mb-4 pl-1"
          >
            mdi-close-circle
          </v-icon>
          </v-row>
      </v-col>
    </v-row>
    <v-data-table
    :headers=headers
    class="mt-2 pa-2"
    :items=filteredItems
    >
    </v-data-table>
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
        snackbar: false,
        snackbarColor: '#73cfa6',
        message: null,
        month: null,
        items: [],
        headers: [
          {text: 'Date', value: 'date', class: 'appgrey--text'},
          {text: 'Amount', value: 'salary', class: 'appgrey--text'},
          {text: 'Month', value: 'month', class: 'appgrey--text'},
          {text: 'Type', value: 'type', class: 'appgrey--text'},
        ],
      }
    },

    async created() {
      try {
        let data = await this.$axios.$get('employee/salary')
        data.salaries.forEach(d => {
          d.date =  this.$moment(d.date).format('DD MMM YYYY')
          d.month = this.$moment(d.month).format('MMMM')
        })
        this.items = [...data.salaries]
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

    computed: {
      filteredItems() {
        if(this.month){
          return this.items.filter(item => {
            return this.$moment(this.month).format('MMMM').toLowerCase() == item.month.toLowerCase()
          })
        } else {
          return this.items
        }
      }
    }

}
</script>

<style scoped>

.theme--light .v-data-table .v-data-footer{
  border-top: 0;
}

.theme--light.v-data-table  .v-data-table__wrapper  table  thead  tr:last-child  th {
  border-bottom: 0;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row), .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:not(.v-data-table__mobile-row){
  border-bottom: 0;
}

</style>

//TODO: FUTURE add option dispute salary