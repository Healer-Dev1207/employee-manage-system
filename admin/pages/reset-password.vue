<template>
  <div class="mt-10">
      <v-row justify="center" align="center">
      <v-card height="500" width="500" elevation="0">
        <div v-if="!$auth.loggedIn" >
          <v-row justify="center">
              <v-img :src="hostImageUrl + avatar" 
              alt="company_logo" 
              height="180px" 
              width="180px"
              contain>
              </v-img>
          </v-row>
          </div>
          <v-row justify="center" class="mt-n6" :class="{'mt-16 mb-5 pt-15': $auth.loggedIn}">
              <v-card-title class="text-h5">Reset Password</v-card-title>
          </v-row>
          <div class="pa-6 " >
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
              <v-btn @click="submit"  color="mainpurple" depressed class="white--text">Submit</v-btn>
          </div> 
      </v-card>
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
  head() {
    return {
      title: 'Reset Password',
    }
  },
  data() {
    return {
      hostImageUrl: process.env.HOST_IMAGE_URL,
      avatar: '/public/images/company_logos/default.jpg',
      password: null,
      confPassword: null,
      snackbar: false,
      snackbarColor: '#73cfa6',
      message: null,
      show: false,
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
    async submit(){
      try {
        if(this.$refs.form.validate()){
          let data = await this.$axios.$post('auth/admin/change-password', {
            token: this.$route.query.token,
            password: this.password,
            confPassword: this.confPassword
          })
          if(data.flag){
            this.message = data.message
            this.snackbarColor = '#73cfa6'
            this.snackbar = true
            setTimeout(() => {
              this.$router.push('/')
            }, 3500)
          }
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
  }
}
</script>