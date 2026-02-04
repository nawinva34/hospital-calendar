// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'ปฏิทินกะการทำงาน โรงพยาบาล',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'ระบบจัดการกะการทำงานของโรงพยาบาล' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  css: [
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/css/global.css'
  ],

  modules: ['vuetify-nuxt-module'],

  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      locale: {
        locale: 'th'
      },
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: '#1976D2',
              secondary: '#424242',
              accent: '#82B1FF',
              error: '#FF5252',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FB8C00',
            },
            variables: {
              'font-family': "'Kanit', sans-serif"
            }
          }
        }
      },
      defaults: {
        global: {
          style: {
            fontFamily: "'Kanit', sans-serif"
          }
        }
      }
    }
  }
})
