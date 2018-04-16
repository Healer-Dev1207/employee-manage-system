<template>
  <v-dialog max-width="600px" v-model="dialog">
    <v-card>
      <v-container>
          <v-card-title>
            <h3 class="textheadpurple--text">Edit Employee</h3>
          </v-card-title>
          <v-card-text>
           <v-form ref="form">
             <v-menu offset-y>
               <template v-slot:activator="{ on, attrs }">
                  <v-text-field color="mainpurple"
                  label="Joined Date" :value="formattedDate" v-bind="attrs" v-on="on"></v-text-field>
                </template>
              <v-date-picker v-model="joined" color="mainpurple"></v-date-picker>
             </v-menu>
             <v-text-field
                color="mainpurple"
                label="Name" 
                v-model="item.name"
              ></v-text-field>
              <v-text-field
              color="mainpurple"
              label="Designation" 
              v-model="item.desg"
              >
              </v-text-field>
              <v-text-field
              color="mainpurple"
              label="Email" 
              v-model="item.email"
              >
              </v-text-field>
              <!-- <v-text-field
              color="mainpurple"
              label="Status" 
              v-model="item.status"
              >
              </v-text-field> -->
              <v-select
                :items=statusItems
                v-model="item.status"
              >

              </v-select>
              <v-row justify="end">
                <v-btn text class="mainpurple mr-10 mt-3 white--text text-capitalize" @click="submit">Edit Employee</v-btn>
              </v-row>
           </v-form>
          </v-card-text>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'
export default {
  props: ['dialog' , 'item'],

  data() {
    return {
      statusItems: ['Active', 'Inactive', 'Disabled', ],
      joined: null,
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length >= 4 || 'Name must be more than 4 characters'
      ],
      designationRules: [
        v => !!v || 'Designation is required',
        v => v.length >= 4 || 'Designation must be more than 4 characters'
      ]
    }
  },

  methods: {
    submit() {
      if(this.$refs.form.validate()){
        let temp = {
          id: this.item._id,
          date: this.joined  ? this.joined : this.item.date,
          name: this.item.name,
          email: this.item.email,
          status: this.item.status,
          desg: this.item.desg
        }
        this.$emit('edit-employee', temp)
        temp = null
        this.dialog = false
        // this.joined = null
      }
    }
  },
  computed: {
    formattedDate(){
        return this.joined ? moment(this.joined).format('DD MMM YYYY') : moment(this.item.date).format('DD MMM YYYY')
    }
  },
}
</script>