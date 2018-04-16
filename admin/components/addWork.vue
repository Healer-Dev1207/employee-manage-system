<template>
    <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="mainpurple" class="white--text text-capitalize" v-bind="attrs"
            v-on="on" @click="dialog = true" elevation=0>
        <v-icon  class="pr-2 ml-n2">
          mdi-plus-box
        </v-icon>
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
                  color="mainpurple"
                  label="Date" 
                  :value="formattedDate" 
                  v-bind="attrs" 
                  v-on="on"
                  :rules="[rules.required]"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" color="mainpurple"></v-date-picker>
              </v-menu>
              <v-text-field
                color="mainpurple"
                label="Quantity" 
                v-model="quantity"
                :rules="[rules.required, rules.number, rules.positive]"
              >
              </v-text-field>
              <v-text-field
                color="mainpurple"
                label="Price" 
                v-model="price"
                :rules="[rules.required, rules.positive]"
              >
              </v-text-field>
              <v-select
                :items=categories
                label="Category"
                color="mainpurple"
                v-model="category"
                :rules="[rules.required]"
              >

              </v-select>
              <v-row justify="end">
                <v-btn text class="mainpurple mr-10 mt-3 white--text text-capitalize" @click="submit" >Submit</v-btn>
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
  data() {
    return{
      dialog: false,
      date: null,
      quantity: null,
      price: null,
      category: null,
      categories: [
        ...this.$auth.user.categories
      ],
      rules: {
        required: v => !!v || 'Required Field.',
        number: v => !!Number.isInteger(Number(v)) || 'Enter a valid Number',
        positive: v => Number(v) > 0 || 'Enter a valid Positive Number'
      }
    }
  },

  methods: {
    submit() {
      if(this.$refs.form.validate()){
        let temp 
        temp = {
          date: this.date,
          quantity: this.quantity,
          price: this.price,
          category: this.category
        }
        console.log(temp)
        this.dialog = false
        this.$emit('add-work', temp)
        this.date = null
        this.quantity = null
        this.price = null
        this.category = null
      }
    }
  },

  computed: {
    formattedDate(){
        return this.date ? moment(this.date).format('DD MMM YYYY') : ''
    },
  }
}
</script>