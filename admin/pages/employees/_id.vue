<template>
  <div >
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
    <edit-dialog  :dialog="dialog" :item="employeeData" @edit-employee="editEmployee"></edit-dialog>
    <v-row class="pa-1 mt-3 pl-3" no-gutters>
      <v-col>
        <v-btn icon :to="'/employees'" nuxt color="subtextgrey">
          <v-icon >mdi-arrow-left</v-icon>
        </v-btn>
      </v-col>
      <v-row no-gutters justify="end" align="end" class="px-1">
        <v-btn color="mainpurple" class="mr-5 white--text text-capitalize" @click="dialog = !dialog" depressed >
          <v-icon small class="pr-2">mdi-pencil</v-icon>
          Edit
        </v-btn>
        <v-btn color="error" @click="delEmployee" depressed>
          <v-icon small class="pr-2 text-capitalize">mdi-delete</v-icon>
          Delete
        </v-btn>
      </v-row>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row >
      <v-col cols="12" md="6" offset-sm="1" offset-md="0">
        <employee-info :employeeData="employeeData" />
      </v-col>
      <v-col offset-sm="1" offset-md="0">
        <v-card max-width="600" elevation="0">
          <v-row class="pa-4" >
            <h3 class="textheadpurple--text">Work Info</h3>
          </v-row>
          <v-divider></v-divider>
          <v-row justify="center" align="center" align-content="center" class="mt-5 ml-1">
            <v-col offset-sm="1">
              <div class="caption"> Work Done </div>
              <h1> {{getTotalWorkDone}} </h1>
            </v-col>
            <v-col>
              <div  class="caption"> Salary Received </div>
              <h1> {{salary}} </h1>
            </v-col>
            </v-row>
            <v-row class="ml-1">
              <v-col offset-sm="1">
                <div  class="caption "> Advance Received </div>
                <h1> {{advance}} </h1>
              </v-col>
              <v-col>
                <div  class="caption"> Outstanding (If any) </div>
                <h1> {{getOustanding}} </h1>
              </v-col>
          </v-row >
        </v-card>
      </v-col>
    </v-row>
    <v-card elevation="0">
      <v-row class="pa-7 mb-n12 mt-n0">
        <v-col cols=12  md=3>
          <h3 class="textheadpurple--text"> Attendance for Month of {{formattedMonth}}</h3>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="pt-6" cols=8 sm=2 md=2>
          <v-row>
          <v-sheet
          :height="20"
          :width="20"
          color="subtextgrey"></v-sheet>
          <span class="pl-4 subtitle-2">Holiday</span> 
          </v-row>
        </v-col>
        <v-col class="pt-6" sm=2 md=2>
          <v-row>
          <v-sheet
          :height="20"
          :width="20"
          color="present"></v-sheet>
          <span class="pl-4 subtitle-2">Present</span> 
          </v-row>
        </v-col>
        <v-col class="pt-6" sm=2 md=2>
          <v-row>
          <v-sheet
          :height="20"
          :width="20"
          color="error"></v-sheet>
          <span class="pl-4 subtitle-2">Absent</span> 
          </v-row>
        </v-col>
        
        <v-col class="mb-n4 mt-n2" md=3>
          <v-menu offset-y >
            <template v-slot:activator="{ on, attrs }">
            <v-text-field
            color="mainpurple"
            label="Month" 
            :value="formattedMonth"
            v-bind="attrs" 
            v-on="on"
            >
            </v-text-field>
            </template>
            <v-date-picker
            v-model="month"
            type="month"
            color="mainpurple"
            elevation="0"
            @change="monthChange"
            min="2021-01"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-divider class="mt-4 mx-7"></v-divider>
      <v-row v-if="!compDays" class="pa-7" justify="center">
        <v-col>
          <h3>No Data available</h3>
        </v-col>
      </v-row>
      <v-row class="pa-1 mx-1" v-else>
        <v-col v-for="(day, i) in compDays" :key="day._id" >
          <v-sheet
            :height="40"
            :width="40"
            :color="day.sheetColor"
            rounded
            class="pa-2 text-center"
            @click="sheetColorManager(day)"
          ><span class="white--text" v-if="i < 9">0{{i + 1}}</span>
          <span class="white--text" v-else>{{i+1}}</span></v-sheet>
        </v-col>
      </v-row>
    </v-card>

    <v-card >
      <v-row class="pa-5" justify="space-between">
        <h4 class="textheadpurple--text">Recent Work</h4>
        <add-work @add-work="addToWork"></add-work>
      </v-row>
      <v-row>
        <v-col class="mx-4 mt-n6">
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-col>
        <v-data-table
        :headers=headers
        :items=works
        show-group-by
        >
        <template v-slot:item.actions = {item}>
            <v-icon
            small
            color="error"
            class="ml-3"
            @click="deleteWork(item)"
            >
              mdi-delete
            </v-icon>
        </template>
        <template v-slot:item.total = {item}>
          {{item.price * item.quantity}}
        </template>
        <template slot="body.append">
          <tr>
            <th>{{null}}</th>
            <th>Total</th>
            <th>{{sumField('quantity')}}</th>
            <th>{{sumField('price')}}</th> 
          </tr>
        </template>
        </v-data-table>
      </v-col>
    </v-card>
  </div>
</template>

<script>
import moment from 'moment'
import employeeInfo from '../../components/employee/employeeInfo'
import editDialog from '../../components/employee/editDialog'


export default {
  components: {
    editDialog,
    employeeInfo
  },
  data() {
    return {
      message: null,
      snackbarColor: '#73cfa6',
      snackbar: false,
      dialog: false,
      value: 0,
      employeeData: {},
      present: null,
      absent: null,
      month: null,
      currentMonth: null,
      days:  31,
      outstanding: 0,
      salary: 0,
      advance: 0,
      totalWorkDone: 0,

      headers: [
        {text: 'Date', value: 'date', class: 'textheadpurple--text'},
        {text: 'Category', value: 'category', class: 'textheadpurple--text'},
        {text: 'Quantity', value: 'quantity', class: 'textheadpurple--text'},
        {text: 'Price', value: 'price', class: 'textheadpurple--text'},
        
        {text: 'Total', value: 'total', class: 'textheadpurple--text'},
        {text: 'Actions', value: 'actions', class: 'textheadpurple--text', sortable: false},
      ],

      works: [
        
      ]
    }
  },

  async created() {
    try{
      let data = await this.$axios.$get('admin/employees/' + this.$route.params.id)
      this.employeeData = data.employee
      this.month = moment().format('YYYY-MM')
      this.currentMonth = this.month
      
      this.getAttendance()
      this.getWorks()
      this.getSalaryAndAdvance()
      
      
    } catch(err) {
      if(err.response){
        this.snackbarColor = 'error'
        this.message = err.response.data.error
        this.snackbar = true
      }
    }
  },

  methods: {
    sumField(key) {
        // sum data in give key (property)
        return this.works.reduce((a, b) => a + (b[key] || 0), 0)
    },
    
    formattedDate(d){
      return d ? moment(d).format('DD MMM YYYY') : ''
    },


    async sheetColorManager(day) {
      try{
        day.sheetColor === 'holiday' ? day.sheetColor = 'present' : 
          (day.sheetColor === 'present' ? day.sheetColor = 'absent' : day.sheetColor = 'holiday')
        let data = await this.$axios.$post('admin/attendance/update', {
          id: day.employees[0]._id,
          status: day.sheetColor
        })
        this.message = data.message
        this.snackbarColor = '#73cfa6'
        this.snackbar = true
        this.getAttendance()
      } catch(err) {
        if(err.response){
          this.snackbarColor = 'error'
          this.message = err.response.data.error
          this.snackbar = true
        }
      }
    },

    async getAttendance(){
      try{
      let data = await this.$axios.$get('admin/attendance/' + this.$route.params.id, {
        params: {
          year_month: this.month
        }
      })
      this.days = data ? data.days : null
      
      } catch(err){
        if(err.response){
          this.snackbarColor = 'error'
          this.message = err.response.data.error
          this.snackbar = true
        }
      } 
    },

    async getSalaryAndAdvance(){
      try{
      this.salary = 0
      this.advance = 0
      let salaries = this.employeeData.salaries.filter(s => moment(s.month).format('YYYY-MM') === this.month)
      if(salaries.length >= 1){
        salaries.forEach((s) => {
          if(s.type === 'Salary'){
            this.salary += s.salary
          } else {
            this.advance += s.salary
          }
        })
      }
    } catch(err){
      console.log(err)
    }
    },

    async editEmployee(data){
      try{
        let data = await this.$axios.$post('admin/employees/edit', {
          id: data.id,
          name: data.name,
          date: data.date,
          desg: data.desg,
          email: data.email,
          status: data.status
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

    async delEmployee(){
      try{
        let data = await this.$axios.$post('admin/employees/delete', {
          id: this.employeeData._id
        })
        
        this.$router.push('/employees')
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

    monthChange(){
      try{
        this.getAttendance()
        this.getSalaryAndAdvance()
      } catch(err) {
        console.log(err)
      }
    },

    async addToWork(w) {
      try {
        let data = await this.$axios.$post('admin/work/add', {
          date: w.date,
          quantity: w.quantity,
          price: w.price,
          category: w.category,
          employee: this.employeeData
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

    async getWorks(){
      try {
        let data = await this.$axios.$get('admin/work/' + this.employeeData._id)
        if(data.works.length >=1) {
          data.works.forEach((w) => {
            w.date = w.date ? moment(w.date).format('DD MMM YYYY') : w.date
            this.works.push(w)
          })
        }
        
      } catch(err) {
        if(err.response){
          this.snackbarColor = 'error'
          this.message = err.response.data.error
          this.snackbar = true
        }
      }
    },

    async deleteWork(item){
      try{
        let data = await this.$axios.$post('admin/work/delete', {
          id: item._id,
        })
        this.getWorks()
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
    }

  },

  computed: {
    formattedMonth(){
      return this.month ? moment(this.month).format('MMMM').toString() : ''
    },
    compDays() {
      if(this.days){
        Array.from(this.days).forEach((v) => {
          v.sheetColor = v.employees[0].status
        })
      }
      return this.days
    },

    getTotalWorkDone() {
      this.totalWorkDone = 0
      if(this.works.length >= 1){
          this.works.forEach((v) => {
            
            if(moment(v.date).format('YYYY-MM') === this.month){
              this.totalWorkDone+= v.price * v.quantity
            }
          })
        }
      return this.totalWorkDone
      },

    getOustanding() {
      this.outstanding = this.totalWorkDone - (this.salary + this.advance)
      return this.outstanding
    },   
  },
  

}
</script>