<template>
    <div class="mt-16">
        <v-row justify="center">
        <v-card height="500" width="500" elevation="0">
            <v-row justify="center" class="mt-8 mb-8">
                <h1>Employee Login</h1>
            </v-row>
            <v-row justify="center" class="mt-2">
                <v-card-title class="text-h5">Welcome back, Please Login</v-card-title>
            </v-row>
            <div class="pa-6 mt-7">
                <v-form ref="form">
                    <v-text-field 
                    v-model="email" 
                    color="mainpurple" 
                    label="Email" 
                    :rules="[rules.required, rules.max, rules.email]"
                    >
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
                <v-btn @click="submitInfo" color="appmainblue" depressed class="white--text">Login</v-btn>
            </div> 
        </v-card>
        </v-row>
        <v-snackbar
        v-model="snackbar"
        :timeout="4000"
        color="error"
        top
        >
        {{error}}
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
    head() {
        return{
            title: 'Login'
        }  
    },
    data() {
        return {
            email: '',
            password: '',
            snackbar: false,
            error: null,
            show: false,
            rules: {
                required: v => !!v || 'Required Field',
                max: v => (v || '').length <= 30 || 'Max 30 characters',
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
                }
            } catch(err) {
                if(err.response){
                    this.snackbar = true
                    this.error = err.response.data.error
                } else {
                    console.log(err)
                }
            }
        }
    }
}
</script>