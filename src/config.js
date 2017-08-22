require('babel-polyfill');

const environment = {
  development: {// 开发环境
    evnname: 'development',
    ServerAPI: 'http://127.0.0.1:30081/xtn/api',                                        // 公司测试环境
    isProduction: false,
    isTest: false,
  },
  testenv: { // 测试环境
    evnname: 'testenv',
    ServerAPI: 'http://192.168.10.100:30181/xtn/api',                                        // 公司测试环境
    isProduction: false,
    isTest: true,
  },
  production: {// 正式环境
    evnname: 'production',
    ServerAPI: 'http://192.168.10.101:30281/xtn/api',
    isProduction: true,
  }
}[process.env.NODE_ENV || 'development'];

const __host = '127.0.0.1';

module.exports = Object.assign({
  host: process.env.HOST || __host,
  port: process.env.PORT,
  apiHost: process.env.APIHOST || __host,
  apiPort: process.env.APIPORT,
  app: {
    title: '',
    description: '轻应用，手机应用程序.',
    head: {
      titleTemplate: '%s',
      meta: [
        { name: 'description', content: '轻应用，手机应用程序.' },
        { charset: 'utf-8' },
        { property: 'og:site_name', content: '' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:title', content: '' },
        { property: 'og:description', content: '轻应用，手机应用程序.' },
        { property: 'og:card', content: 'summary' },
        { property: 'og:site', content: '@jiaxin' },
        { property: 'og:creator', content: '@jiaxin' },
        { property: 'og:image:width', content: '200' },
        { property: 'og:image:height', content: '200' }
      ],
      script: [
        { type: 'text/javascript', src: 'http://127.0.0.1:18080/lib.js' }
      ]
    },
    Environment: environment.isProduction,
    IsHideNavBar: false, // environment.isProduction,
    BuildPublicPath: '/xtn/',
    BaseName: '/xtn/',
  },
}, environment);
