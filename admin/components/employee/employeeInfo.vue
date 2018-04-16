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
		<v-card max-width="600" elevation="0">
      <v-row class="pa-4" justify="space-between">
        <h3 class="textheadpurple--text">Employee Info</h3>
        <v-dialog max-width="600px" v-model="dialog">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
            depressed
            class="error--text text-capitalize subtitle-1 mb-n4"
            v-bind="attrs"
            v-on="on" 
            @click="dialog = true"
            >
              Change Password
            </v-btn>
          </template>
          <v-card>
            <v-container>
              <v-card-title>
                Change Password
              </v-card-title>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field 
                  v-model="password" 
                  color="mainpurple" 
                  label="Password" 
                  :rules="[rules.required, rules.min, rules.passwordRegex]"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  @click:append="show = !show"
                  >
                  </v-text-field>
                  <v-text-field 
                  v-model="confPassword" 
                  color="mainpurple" 
                  label="Confirm Passord" 
                  :rules="[rules.required, rules.min, rules.matchPassword,]"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  @click:append="show = !show"
                  >
                  </v-text-field>
                </v-form>
                <v-btn @click="changePassword"  color="mainpurple" depressed class="white--text">Change</v-btn>
              </v-card-text>
            </v-container>
          </v-card>
        </v-dialog>
      </v-row>
      <v-divider></v-divider>
      <v-row class="pa-7 pb-10 mt-n3" justify="center" align="center" align-content="center">
        <v-col class="mr-5 pt-5" cols="12" lg="4" align-self="center" offset="5" offset-sm="7" offset-md="0" >
          <v-avatar size="160" rounded>
            <v-img
            contain
            :src="hostImageUrl + computedAvatar"
            >
            </v-img>
          </v-avatar>
        </v-col>
        <v-col class="mb-n7" offset="1" offset-sm=2 offset-md="0">
          <v-row class="mt-n3">
              <v-col cols="5">
                <h4 class="subtextgrey--text subtitle-1 text-capitalize">Joined Date: </h4> 
              </v-col>
              <v-col cols="6">
                <h4 class="textheadpurple--text">{{ $moment(employeeData.date).format('DD MMM YYYY') }}</h4>
              </v-col>
          </v-row>
          <v-row class="mt-n5">
              <v-col cols="5">
                <h4 class="subtextgrey--text subtitle-1 text-capitalize">Name: </h4> 
              </v-col>
              <v-col cols="6">
                <h4 class="textheadpurple--text text-capitalize">{{employeeData.name}}</h4>
              </v-col>
          </v-row>
          <v-row class="mt-n5">
              <v-col cols="5">
                <h4 class="subtextgrey--text subtitle-1 text-capitalize">Email: </h4> 
              </v-col>
              <v-col cols="6">
                <h4 class="textheadpurple--text ">{{employeeData.email}}</h4>
              </v-col>
          </v-row>
          <v-row class="mt-n5">
              <v-col cols="5">
                <h4 class="subtextgrey--text subtitle-1 text-capitalize">Designation: </h4> 
              </v-col>
              <v-col cols="6">
                <h4 class="textheadpurple--text text-capitalize">{{employeeData.desg}}</h4>
              </v-col>
          </v-row>
          <v-row class="mt-n5">
              <v-col cols="5">
                <h4 class="subtextgrey--text subtitle-1 text-capitalize">Status: </h4> 
              </v-col>
              <v-col cols="6">
                <h4 class="textheadpurple--text text-capitalize">
                  <v-chip
                  :color="computedChipColor"
                  label
                  :class="whiteText"
                  >
                  {{employeeData.status}}
                  </v-chip>
                  </h4>
              </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
	</div>
</template>

<script>

export default {
  props: ['employeeData'],
  data() {
    return {
      message: null,
      snackbarColor: '#73cfa6',
      snackbar: false,
      hostImageUrl: process.env.HOST_IMAGE_URL,
      show: false,
      password: null,
      confPassword: null,
      dialog: false,
      chipColor: null,
      avatar: null,
      rules: {
        required: v => !!v || 'Required Field',
        min: v => (v || '').length >= 8 || 'Min 8 characters',
        matchPassword: () => (this.password === this.confPassword) || 'Passwords do not match',
        passwordRegex: v => {
          let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
          return pattern.test(v) || 'Min 8 Characters, atleast 1 uppercase, lowercase character and a number!'
        }
      }
    }
  },
  methods: {
    async changePassword() {
      try {
        if(this.$refs.form.validate()){
          let data = await this.$axios.$post('admin/employees/changepassword', {
            id: this.employeeData._id,
            password: this.password,
            confPassword: this.confPassword
          })
          this.dialog = false
          this.message = data.message
          this.snackbarColor = '#73cfa6'
          this.snackbar = true
        }
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
    computedChipColor() {
      if(this.employeeData.status === 'Disabled'){
        return 'red'
      } else if(this.employeeData.status === 'Active'){
        return 'success'
      } else {
        return null
      }
    },
    whiteText() {
      if(this.employeeData.status === 'Disabled' || this.employeeData.status === 'Active'){
        return 'white--text'
      } else {
        return null
      }
    },
    computedAvatar() {
      this.avatar = this.employeeData.avatar ? this.employeeData.avatar.url : '/public/images/avatars/default.png'
      return this.avatar
    }
  },
}

</script>