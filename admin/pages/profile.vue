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
      <h2>Profile</h2>
        <v-row class="mt-4 px-4 pt-3" justify="start" align-content="start">
          <v-col cols=12 md=4 sm=5 class="mb-6">
            <v-card shaped width="200" flat outlined>
              <v-img
              :src="hostImageUrl + company_logo"
              height='200'
              width='200'
              contain
              >
              </v-img>
            </v-card>
            <v-btn color="mainpurple" class="white--text text-capitalize mt-2 mx-auto" depressed  @click="$refs.company_logo.click()">
              <input type="file" id="file" ref="company_logo" accept="image/*" v-show="false" @change="uploadCompanyLogo"  />
              Change Company Logo
            </v-btn>
          </v-col>
        </v-row>
        <v-form ref="form">
        <v-row class="px-4 pt-3" justify="center" align-content="center">
          <v-col>
          <v-text-field
          label="Name"
          v-model="name"
          color="mainpurple">
          </v-text-field>
          </v-col>
          <v-col>
          <v-text-field
          label="Email"
          v-model="email"
          color="mainpurple">
          </v-text-field>
          </v-col>
        </v-row>
        <v-row class="px-4" justify="center" align-content="center">
          <v-col>
            <v-text-field
            label="Company Name"
            v-model="company"
            color="mainpurple">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row justify="end" align-content="end">
          <v-col>
            <v-btn
            color="mainpurple"
            depressed
            class="white--text text-capitalize ml-4"
            @click="updateProfile"
            >
              Save
            </v-btn>
          </v-col>
          <v-col align-self="end">
            <v-btn
            depressed
            class="error--text text-capitalize subtitle-1"
            @click="resetPassword"
            >
            Reset Password
            </v-btn>
          </v-col>
        </v-row>

        </v-form>
    </v-container>
  </div>
</template>

<script>
export default {
  data(){
    return {
      snackbar: false,
      snackbarColor: '#73cfa6',
      hostImageUrl: process.env.HOST_IMAGE_URL,
      message: null,
      file: null,
      name: this.$auth.$state.user.name ? this.$auth.$state.user.name : '',
      email: this.$auth.$state.user.email ? this.$auth.$state.user.email : '',
      company: this.$auth.$state.user.company ? this.$auth.$state.user.company : '',
      company_logo: this.$auth.$state.user.company_logo ? this.$auth.$state.user.company_logo.url : '/public/images/company_logos/default.jpg'
    }
  },
  methods: {
    async updateProfile(){
      try{
        if(this.$refs.form.validate()){
          let data = await this.$axios.$post('admin/profile/update', {
            name: this.name,
            email: this.email,
            company: this.company
          })
          this.message = data.message
          this.snackbarColor = '#73cfa6'
          this.snackbar = true
        }
        this.$auth.$state.user.company = this.company
      } catch(err){
        if(err.response){
          this.message = err.response.data.error
          this.snackbarColor = 'error'
          this.snackbar = true
        }
      }
    },
    async uploadCompanyLogo() {
      try {
        this.file = this.$refs.company_logo.files[0]
        let formData = new FormData()
        formData.append('file', this.file)
        console.log(formData)
        let data = await this.$axios.$post('admin/profile/changelogo', formData)
        this.message = data.message
        this.snackbarColor = '#73cfa6'
        this.snackbar = true
        this.company_logo = data.company_logo
      } catch(err) {
        if(err.response){
          this.message = err.response.data.error
          this.snackbarColor = 'error'
          this.snackbar = true
        }
      }
    },

    async resetPassword() {
      try {
        let data = await this.$axios.$post('auth/admin/sendresetemail', {
          email: this.$auth.$state.user.email
        })
        this.message = data.message
        this.snackbarColor = 'mainpurple'
        this.snackbar = true
      } catch(err) {
        if(err.response){
          this.message = err.response.data.error
          this.snackbarColor = 'error'
          this.snackbar = true
        }
      }
    }
  }
}
</script>