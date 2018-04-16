<template>
    <div class="mt-4">
        <v-row justify="center" align-content="center">
        <v-card height="600" width="500" class="mt-8">
            <v-row justify="center" class="mb-8 mt-4">
                <h1>Admin Login</h1>
            </v-row>
            <v-row justify="center" class="mt-4">
                <v-card-title class="text-h5">Welcome back, Please Login</v-card-title>
            </v-row>
            <div class="pa-6 mt-2">
                <v-form ref="form">
                    <v-text-field v-model="email" color="mainpurple" label="Email" :rules="[rules.required, rules.max, rules.email]">
                        Email
                    </v-text-field>
                    <v-text-field 
                    v-model="password" 
                    color="mainpurple" 
                    label="Password" 
                    :rules="[rules.required, rules.max]"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    @click:append="show = !show"
                    >
                        Password
                    </v-text-field>
                </v-form>
                <v-row justify="space-between" align-content="space-between">
                    <v-btn @click="submitInfo" color="mainpurple" class="white--text ml-3">Login</v-btn>

                    <v-dialog max-width="600px" v-model="dialog">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                        depressed
                        class="error--text text-capitalize subtitle-1"
                        v-bind="attrs"
                        v-on="on"
                        >
                        Forgot your password?
                        </v-btn>
                      </template>
                      <v-card>
                        <v-container>
                          <v-card-title>
                            <h3>Send Password Email</h3>
                          </v-card-title>
                          <v-card-text>
                            <v-text-field
                            label="Enter your email"
                            v-model="resetEmail"
                            >

                            </v-text-field>
                          </v-card-text>
                          <v-row justify="end">
                            <v-btn
                            text 
                            class="mainpurple mb-2 mr-7 mt-n4  white--text text-capitalize"
                            @click="sendEmail">
                              Send
                            </v-btn>
                          </v-row>
                        </v-container>
                      </v-card>
                    </v-dialog>
                </v-row>
            </div> 
        </v-card>
        </v-row>
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
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: null,
            snackbarColor: '#73cfa6',
            resetEmail: null,
            dialog: false,
            hostImageUrl: process.env.HOST_IMAGE_URL,
            company_logo:  '/public/images/company_logos/default.jpg',
            email: '',
            password: '',
            snackbar: false,
            error: null,
            show: false,
            rules: {
                required: v => !!v || 'Required Field',
                max: v => (v || '').length <= 50 || 'Max 50 characters',
                email: v => {
                    let pattern = /\S+@\S+\.\S+/
                    return pattern.test(v) || 'Enter a valid email!'
                }
            }
        }
    },
    methods: {
        async submitInfo() {
            try{
                if(this.$refs.form.validate()){
                    await this.$auth.loginWith('local', {data: {email: this.email, password: this.password}})
                    setTimeout(() => {
                      this.$router.push('/')
                    }, 1000)
                }
            } catch(err) {
                if(err.response){
                    this.snackbarColor = 'error'
                    this.message = err.response.data.error
                    this.snackbar = true
                } else {
                    console.log(err)
                }
            }
        },
        async sendEmail() {
          try {
            let data = await this.$axios.$post('auth/admin/sendresetemail', {
              email: this.resetEmail
            })
            this.dialog = false
            this.message = data.message
            this.snackbarColor = '#73cfa6'
            this.snackbar = true
            this.resetEmail = null
          } catch(err) {
            if(err.response){
              console.log(err.response.data.error)
              this.message = err.response.data.error
              this.snackbarColor = 'error'
              this.snackbar = true
            }
          }
        }
    }
}
</script>