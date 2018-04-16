<template>
  <div>
    <v-dialog max-width="600px" v-model="dialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="appmainblue" class="white--text text-capitalize" v-bind="attrs" v-on="on" @click="dialog = true" depressed small>
        Add Work
      </v-btn>
      </template>
    <v-card>
      <v-container>
        <v-card-title>
          <h3>Add Work</h3>
        </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field 
                  color="appmainblue"
                  label="Date" 
                  v-bind="attrs" 
                  v-on="on"
                  :value="date ? $moment(date).format('Do MMMM YYYY') : null"
                  :rules="[rules.required]"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" color="appmainblue"></v-date-picker>
              </v-menu>
              <v-text-field
                color="appmainblue"
                label="Quantity" 
                v-model="quantity"
                :rules="[rules.required, rules.number, rules.positive]"
              >
              </v-text-field>
              <v-text-field
                color="appmainblue"
                label="Price" 
                v-model="price"
                :rules="[rules.required, rules.positive]"
              >
              </v-text-field>
              <v-select
                :items=categories
                label="Category"
                color="appmainblue"
                item-text="category"
                item-value="category"
                v-model="category"
                :rules="[rules.required]"
              >

              </v-select>
              <v-row justify="end">
                <v-btn text class="appmainblue mr-10 mt-3 white--text text-capitalize" @click="submit">Submit</v-btn>
              </v-row>
            </v-form>
          </v-card-text>
      </v-container>
    </v-card>
    </v-dialog>
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
  data(){
    return {
      snackbar: null,
      snackbarColor: '#73cfa6',
      message: null,
      dialog: false,
      date: null,
      quantity: null,
      price: null,
      category: null,
      categories: this.$auth.$state.user.categories,
      rules: {
        required: v => !!v || 'Required Field.',
        number: v => !!Number.isInteger(Number(v)) || 'Enter a valid Number',
        positive: v => Number(v) > 0 || 'Enter a valid Positive Number'
      }
    }
  },
  methods: {
    async submit() {
      try {
        if(this.$refs.form.validate()){
          this.dialog = false
          let temp = {
            date: this.date,
            quantity: this.quantity,
            price: this.price,
            category: this.category,
            employee: this.$auth.$state.user.employee._id
          }
          this.data = null
          this.quantity = null
          this.price = null
          this.category = null
          let data = await this.$axios.$post('employee/works/add', temp)
          this.message = data.message
          this.snackbarColor = '#73cfa6'
          this.snackbar = true
          this.$emit('add-work', temp)
        }
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
}
</script>