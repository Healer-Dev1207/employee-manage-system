import colors from 'vuetify/es5/util/colors'
require('dotenv').config()

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  
  head: {
    titleTemplate: '%s - employee',
    title: 'employee',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel:"preconnect", href:"https://fonts.gstatic.com"},
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/vue-awesome-countdown',
    '@/plugins/vue-observe-visibility',
    {src: '@/plugins/vue-apexchart', ssr: false}
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/toast',
    '@nuxtjs/auth-next',
    '@nuxtjs/moment',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    '@nuxtjs/auth-next',
    '@nuxtjs/moment',
    '@nuxtjs/dotenv',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL:  process.env.BASE_URL 
  },

  auth: {
    redirect: {
      login: '/login',
      logout: '/',
      home: '/'
    },
    strategies: {
      local: {
        token: {
          property: 'token',
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: 'user',
          // autoFetch: true
        },
        endpoints: {
          login: { url: '/auth/admin', method: 'post'},
          logout: false,
          user: { url: '/auth/admin/me', method: 'get' }
        }
      }
    }
  },

  toast: {
    position: 'bottom-right',
    duration: 1000,
    keepOnHover: true
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    font: {
      family: 'Inter'
    },
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          lightpurple: '#BABBCD',
          headpurple: '#8CA9C6',
          mainpurple: '#645DF6',
          textheadpurple: '#000000', // 151542
          subtextgrey: '#8e8e8e',
          holiday: '#9896B0',
          present: colors.green.darken2,
          absent: colors.deepOrange.accent4,
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
