import { Config } from '@tarojs/taro';

export default {
  pages: [
    // 'news/detail/index',
    // 'house/rent/index/index',
    'pages/index/index',
    'pages/chat/index',
    'pages/user/index',
  ],
  subPackages: [
    {
      root: 'house',
      pages: [
        'new/index/index',
        'new/album/index',
        'new/video/index',
        'new/list/index',
        'new/search/index',
        'new/surround/index',
        'new/sand/index',
        'new/detail/index',
        'new/type/index',
        'new/type/detail',
        'new/news/index',
        'new/news/detail',
        'new/ask/index',
        'new/askForm/index',
        'new/comment/index',
        'new/commentForm/index',
        'new/consultant/index',
        'city/index',
        'search/index',

        'esf/index/index',
        'esf/list/index',
        'esf/search/index',

        'rent/index/index',
        'rent/list/index',
        'rent/search/index',
      ]
    },
    {
      root: 'login',
      pages: [
        'index',
        'phone/index'
      ]
    },
    {
      root: 'news',
      pages: [
        'list/index',
        'detail/index'
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
