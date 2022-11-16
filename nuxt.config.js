export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'appIoT',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Poppins:200,300,400,600,700,800' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css' }
    ],
    bodyAttrs: {
      class: '' // Add `white-content` class here to enable "white" mode.
    }
  },

  //Routering de la pagina
  router: {
    linkExactActiveClass: 'active'
  },
  
  // Customize the progress-bar color

  loading: { color: '#fff' },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'assets/css/demo.css',
    'assets/css/nucleo-icons.css',
    'assets/sass/black-dashboard.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    `~/plugins/dashboard-plugin.js`,
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    {
      path: '~/components',
      pathPrefix:false,
      extensions: ['vue','jsx'],
    }
  ],
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    'nuxt-highcharts',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: "http://127.0.0.1:3001/api"
  },
  // //para acceder desde cualquier IP
  server: {
    port: 3000,
    host:'0.0.0.0'
  },
  // // Para que se arranque la pai cuando se aranque el front
  serverMiddleware: {
    '/api': '~/api'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    },
    babel: {
      plugins: [
        [
          'component',
          {
            'libraryName': 'element-ui',
            'styleLibraryName': 'theme-chalk'
          }
        ]
      ]
    }
  }
}
