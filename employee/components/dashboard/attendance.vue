<template>
  <div class="mt-14 pa-2">
    <v-row align-content="space-between" justify="space-between">
      <v-col cols=2 md=8>
        <h3>Attendance Overview</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col md=2 cols=4>
        <v-menu offset-y >
            <template v-slot:activator="{ on, attrs }">
            <p
            v-bind="attrs" 
            v-on="on"
            class="appgrey--text"
            >
              {{$moment(month).format('MMM \'YY')}}
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
            :max="$moment().format('YYYY-MM')"
            @change="getAttendance"
            ></v-date-picker>
          </v-menu>
      </v-col>
    </v-row>
    <v-row class="pa-1 mx-1">
      <v-col v-for="(day,i) in compDays" :key="i" class="ma-1">
        <v-sheet
            :height="30"
            :width="30"
            :color="day.sheetColor"
            outlined
            rounded
            class="pa-2 pr-6"
          >
          <div class="white--text subtitle-2 mt-n1" v-if="i < 9">0{{i + 1}}</div>
          <div class="white--text subtitle-2 mt-n1" v-else>{{i+1}}</div>
        </v-sheet>
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
        message: null,
        snackbarColor: '#73cfa6',
        month: this.$moment().format('YYYY-MM'),
        days: 31
      }
    },
    methods: {
      async getAttendance() {
        try {
          let data = await this.$axios.$get('employee/home/attendance', {
            params: {
              year_month: this.month
            }
          })
          this.days = data ? data.days : null
        } catch(err) {
          if(err.response){
            this.message = err.response.data.error
            this.snackbarColor = 'error'
            this.snackbar = true
          } else {
            console.log(err)
          }
        }
      }
    },
    async created() {
      try {
        this.getAttendance()
      } catch(err) {
        if(err.response){
          this.message = err.response.data.error
          this.snackbarColor = 'error'
          this.snackbar = true
        } else {
          if(err.response){
            this.message = err.response.data.error
            this.snackbarColor = 'error'
            this.snackbar = true
          } else {
            console.log(err)
          }
        }
      }
    },

    computed: {
      compDays() {
        if(this.days){
          Array.from(this.days).forEach((v) => {
            v.sheetColor = v.employees[0].status
          })
        }
        return this.days
      },
    }
}
</script>
