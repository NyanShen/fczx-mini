import { Config } from '@tarojs/taro';

export default {
  pages: [
    'house/pages/new/index/index',
    'pages/index/index',
    'pages/chat/index',
    'pages/user/index'
  ],
  subPackages: [
    // {
    //   root: 'house',
    //   pages: [
    //     'pages/new/index/index',
    //     'pages/new/album/index',
    //     'pages/new/list/index',
    //     'pages/new/search/index',
    //     'pages/new/surround/index',
    //     'pages/new/sand/index',
    //     'pages/new/detail/index',
    //     'pages/city/index',
    //     'pages/search/index',
    //   ]
    // },
    {
      root: 'login',
      pages: [
        'pages/index',
        'pages/phone/index'
      ]
    }
  ],
  tabBar: {
    color: 'rgba(68, 68, 68, 1)',
    selectedColor: 'rgba(68, 68, 68, 1)',
    backgroundColor: 'white',
    list: [
      {
        iconPath: './assets/icons/home.png',
        selectedIconPath: './assets/icons/home_hv.png',
        text: '首页',
        pagePath: 'pages/index/index'
      },
      {
        iconPath: './assets/icons/chat.png',
        selectedIconPath: './assets/icons/chat_hv.png',
        text: '微聊',
        pagePath: 'pages/chat/index'
      },
      {
        iconPath: './assets/icons/user.png',
        selectedIconPath: './assets/icons/user_hv.png',
        text: '我的',
        pagePath: 'pages/user/index'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#11a43c',
    navigationBarTitleText: '房产在线',
    navigationBarTextStyle: 'white',
    navigationStyle: 'custom'
  }
} as Config
