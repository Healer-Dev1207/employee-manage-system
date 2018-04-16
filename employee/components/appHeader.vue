<template>
  <div v-if="$auth.loggedIn">
    <div align="center"> 
      <v-app-bar class="px-1 pa-1" flat>
        <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>
        <h2>{{$store.state.head.appHead}}</h2>
      </v-app-bar>
    </div>
    <v-navigation-drawer v-model="drawer"  app >
      <v-list class="mt-2" nav>
        <v-list-item>
          <v-list-item-content class="pb-6">
            <NuxtLink to="/" >
            <v-list-item-title class="appmainblue--text" @click="$store.commit('head/set', 'Overview')">
              
              <v-icon class="mb-1 px-2" color="appmainblue">mdi-shopping-outline</v-icon>
              {{$auth.$state.user.employee.company}}
              
            </v-list-item-title>
            </NuxtLink>
          </v-list-item-content>
        </v-list-item>
        <v-list-item 
        v-for="(item, i) in navItems" 
        :key="i" class="pl-8 mt-2 tile" 
        :to="item.route" 
        active-class="active--nav" 
        color="white" 
        nuxt
        @click="$store.commit('head/set', item.title)"
        >
          
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content class="pl-1 ">
            <v-list-item-title>
              {{item.title}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
      <template v-slot:append>
        <div v-if="$auth.loggedIn" class="text-center pb-6">
          <v-btn @click="logoutFn" 
          depressed
          class="error--text"
          >
          <v-icon color="error">mdi-logout-variant</v-icon>
          Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    
  </div>
</template>

<script>
export default {
    data() {
      return {
        currentHead: 'Overview',
        drawer: true,
        navItems: [
          {title: 'Overview', icon: 'mdi-chart-donut', route: '/'},
          {title: 'Salary', icon: 'mdi-wallet-outline', route:'/salary'},
          {title: 'Work', icon: 'mdi-briefcase-outline', route:'/work'},
          {title: 'Profile', icon: 'mdi-account-outline', route:'/profile'}
        ]
      }
    },
    methods: {
      logoutFn() {
        this.$auth.logout()
        this.$router.push('/login')
      }
    }
}
</script>

<style scoped>

.active--nav {
  background-color: #316cf5;
}

.nuxt-link-active{
  text-decoration: none !important;
}

/* .tile:active {
  color: #ffffff !important;
  background: #316cf5;
} */

.tile:hover {
  color: white !important;
  background: #316cf5;
}

</style>