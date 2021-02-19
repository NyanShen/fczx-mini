const { resolve } = require('dns')
const path = require('path')

const resolvePath = (pathname) => {
  return path.resolve(__dirname, '..', pathname)
}

const IS_H5 = process.env.TARO_ENV === 'h5'

const config = {
  projectName: 'mini',
  date: '2020-8-6',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  plugins: [],
  defineConstants: {
    IS_H5,
    IS_WEAPP: process.env.TARO_ENV === 'weapp',
    API_URL: IS_H5 ? '"/api"' : '"https://api.fczx.com"',
    AREA_API_URL: IS_H5 ? '"/areaapi"' : '"https://areaapi.fczx.com"'
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  mini: {
    webpackChain(chain, webpack) {
      // chain.plugin('analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    router: {
      mode: 'browser', // 或者是 'hash会有#号'
      customRoutes: {
        '/pages/index/index': '/index'
      }
    }
  },
  alias: {
    '@': resolvePath('src'),
    '@components': resolvePath('src/components'),
    '@constants': resolvePath('src/constants'),
    '@services': resolvePath('src/services'),
    '@hooks': resolvePath('src/hooks'),
    '@utils': resolvePath('src/utils'),
    '@assets': resolvePath('src/assets'),
    '@styles': resolvePath('src/styles'),
    '@pages': resolvePath('src/pages'),
    '@house': resolvePath('src/house'),
  },
  sass: {
    resource: resolvePath('src/styles/variable.scss')
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
