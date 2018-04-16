<template>
  <div>
    <v-container>
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
    <h3>My Account</h3>
    <v-row class="mt-2 pa-2" justify="space-around" align-content="space-around">
      <v-col cols=12 md=4 sm=5 class="mb-6">
        <v-card shaped width="200" flat outlined>
          <v-img 
          :src="hostImageUrl + avatar"
          height='200'
          width='200'
          contain
          >
          </v-img>
        </v-card>
        <v-btn color="appmainblue" class="white--text text-capitalize mt-2 mx-auto" depressed  @click="$refs.profile.click()">
          <input type="file" id="file" ref="profile" accept="image/*" v-show="false" @change="uploadProfile" />
          Change Avatar
        </v-btn>
      </v-col>
      <v-col align-self="center" class="mx-auto">
        <v-form ref="form">
        <v-row class="mb-n3">
          <v-col>
          <v-text-field
          label="Joined Date"
          color="appmainblue"
          flat
          v-model="joinedDate"
          readonly
          >
          </v-text-field>
          </v-col>
          <v-col>
          <v-text-field
          label="Designation"
          color="appmainblue"
          v-model="designation"
          readonly
          >
          </v-text-field>
          </v-col>
          </v-row>
          <v-text-field
          label="Email"
          color="appmainblue"
          v-model="email"
          readonly
          >
          Email
          </v-text-field>
          <v-row>
            <v-col>
            <h3 class="my-1 ">Update</h3>
            </v-col>
          </v-row>
          <v-row>
          <v-col>
          <v-text-field
          label="First Name"
          color="appmainblue"
          flat
          v-model="firstName"
          :rules="[rules.required, rules.nameMax]"
          @change="isChanged = true"
          >
          </v-text-field>
          </v-col>
          <v-col>
          <v-text-field
          label="Last Name"
          color="appmainblue"
          v-model="lastName"
          :rules="[rules.required, rules.nameMax]"
          @change="isChanged = true"
          >
          </v-text-field>
          </v-col>
          </v-row>
         
          <v-text-field
          label="Phone No."
          color="appmainblue"
          v-model="phone"
          :rules="[rules.required, rules.number, rules.minPhone,  rules.maxPhone]"
          prefix="+91"
          @change="isChanged = true"
          >
          </v-text-field>
          <v-row>
          <v-col>
          <v-text-field
          label="Address"
          color="appmainblue"
          v-model="address"
          :rules="[rules.required, rules.addMax]"
          @change="isChanged = true"
          >

          </v-text-field>
          </v-col>
            
            <v-col>
            <v-text-field
            label="City"
            color="appmainblue"
            v-model="city"
            :rules="[rules.required, rules.nameMax]"
            @change="isChanged = true"
            >
            </v-text-field>
            </v-col>
            </v-row>
            <v-row>
            <v-col>
            <v-text-field
            label="State"
            color="appmainblue"
            v-model="state"
            :rules="[rules.required, rules.nameMax]"
            @change="isChanged = true"
            >
            </v-text-field>
            </v-col>
            <v-col>
            <v-text-field
            label="Zip"
            color="appmainblue"
            v-model="zip"
            :rules="[rules.required, rules.zipMax, rules.zipMin]"
            @change="isChanged = true"
            >
            </v-text-field>
            </v-col>
            </v-row>
          <v-row>
            <v-col>
              <v-btn
              color="appmainblue"
              depressed
              class="white--text mt-2"
              @click="updateProfile"
              :disabled="isChanged ? false : true "
              >
              
                Save
              </v-btn>
            </v-col>
            <v-col class="mt-2">
              <v-btn
                depressed
                class="error--text text-capitalize subtitle-1"
                @click="resetPassword"
                :disabled="clickedFlag"
                >
                Reset Password
                </v-btn>
                <p class="error--text caption ml-1" v-if="clickedFlag">Resend Email in  {{minutes}} Minutes {{seconds}} secs</p>
            </v-col>
          </v-row>
          
          </v-form>
      </v-col>
    </v-row>
    </v-container>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
  middleware: 'auth',
  head() {
    return {
      title: 'Profile'
    }
  },
  data() {
    return{
      hostImageUrl: process.env.HOST_IMAGE_URL,
      isChanged: false,
      snackbar: false,
      snackbarColor: '#73cfa6',
      message: null,
      file: null,
      avatar: this.$auth.$state.user.employee.avatar ? this.$auth.$state.user.employee.avatar.url : '/public/images/avatars/default.jpg',
      joinedDate: this.$moment(this.$auth.user.employee.date).format('MMM Do YYYY'),
      designation: this.$auth.user.employee.desg,
      firstName: this.$auth.$state.user.employee.name.split(' ')[0].trim(),
      lastName: this.$auth.$state.user.employee.name.split(' ')[1].trim(),
      email:  this.$auth.$state.user.employee.email,
      phone: this.$auth.$state.user.employee.phone ? this.$auth.$state.user.employee.phone  : '',
      address: this.$auth.$state.user.employee.address ? this.$auth.$state.user.employee.address  : '',
      city: this.$auth.$state.user.employee.city ? this.$auth.$state.user.employee.city  : '',
      state: this.$auth.$state.user.employee.state ? this.$auth.$state.user.employee.state  : '',
      zip: this.$auth.$state.user.employee.zip ? this.$auth.$state.user.employee.zip  : '',

      rules: {
        required: v => !!v || 'Required Field',
        nameMax: v => (v || '').length <= 20 || 'Max 20 characters',
        email: v => {
          let pattern = /\S+@\S+\.\S+/
          return pattern.test(v) || 'Enter a valid email!'
        },
        emailMax: v => (v || '').length <= 50 || 'Max 50 characters',
        number: v => !!Number.isInteger(Number(v)) && Number(v) > 0 || 'Enter a valid Phone Number',
        maxPhone: v => v.toString().length <= 10|| 'Max 10 Characters',
        minPhone: v => v.toString().length >= 10|| 'Min 10 Characters',
        addMax: v => (v || '').length <= 30 || 'Max 30 characters',
        zipMax: v => v.toString().length <= 6|| 'Max 6 Characters',
        zipMin: v => v.toString().length >= 6|| 'Min 6 Characters'
      }
    }
  },
  methods:{
    ...mapActions({
      setTimeInterval: 'timer/setTimeInterval'
    }),
    async updateProfile() {
      try {
        if(this.$refs.form.validate()){
          let data = await this.$axios.$post('employee/profile/update', {
            name: this.firstName + ' ' + this.lastName,
            phone: this.phone,
            address: this.address,
            city: this.city.trim(),
            state: this.state.trim(),
            zip: this.zip
          })
          this.message = data.message
          this.snackbarColor = '#73cfa6'
          this.snackbar = true
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
    },

    async uploadProfile() {
      try {
        this.file = this.$refs.profile.files[0]
        let formData = new FormData()
        formData.append('file', this.file)
        let data = await this.$axios.$post('employee/profile/changeavatar', formData)
        this.message = data.message
        this.snackbarColor = '#73cfa6'
        this.snackbar = true
        this.avatar = data.avatar
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

    async resetPassword() {
      try {
        let data = await this.$axios.$post('employee/profile/resetpassword', {
          email: this.email,
          cooldown: this.clickedFlag
        })
        this.message = data.message
        this.snackbarColor = 'appmainblue'
        this.snackbar = true
        this.setTimeInterval(2)
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
  },
  computed: {
    ...mapState({
      seconds: state => state.timer.seconds,
      minutes: state => state.timer.minutes,
      clickedFlag: state => state.timer.clicked
    })
  },

}
</script>

<style >

.v-text-field .v-input__control .v-input__slot::before{
  border-style: none;
}


</style>