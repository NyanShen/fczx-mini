module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {
    devServer: {
      host: "192.168.2.248",
      port: 12306
    }
  },
  h5: {
    devServer: {
      host: "m.loubei.com",
      port: 80,
      open: false,
      proxy: {
        '/api/': {
          target: 'https://api.fczx.com',
          ws: true, //开启websoket
          pathRewrite: {
            '^/api/': '/'
          },
          changeOrigin: true
        },
        '/areaapi/': {
          target: 'https://areaapi.fczx.com',
          pathRewrite: {
            '^/areaapi/': '/'
          },
          changeOrigin: true
        }
      }
    }
  }
}
