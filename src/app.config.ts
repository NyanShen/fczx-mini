import { Config } from '@tarojs/taro';

export default {
  pages: [
    // 'news/detail/index',
    // 'house/community/list/index',
    // 'calculator/index',
    'pages/index/index',
    'pages/user/index',
    'pages/chat/index',
    'pages/entry/index',
  ],
  subPackages: [
    {
      root: 'house',
      pages: [
        'new/index/index',
        'new/album/index',
        'new/video/index',
        'new/list/index',
        'new/map/index',
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

        'community/index/index',
        'community/list/index',
        'community/search/index',

        'manage/sale/index',
        'manage/list/index',

        'sale/photo/index',
        'sale/community/index'
      ]
    },
    {
      root: 'login',
      pages: [
        'index',
        'phone/index',
        'register/index',
      ]
    },
    {
      root: 'news',
      pages: [
        'list/index',
        'detail/index'
      ]
    },
    {
      root: 'chat',
      pages: [
        'room/index'
      ]
    },
    {
      root: 'calculator',
      pages: [
        'index'
      ]
    }
  ],
  tabBar: {
    color: '#333333',
    selectedColor: '#11a43c',
    backgroundColor: '#ffffff',
    borderStyle: "black",
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
    navigationBarTitleText: '',
    navigationBarTextStyle: 'white',
  },
  permission: {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
    }
  }
} as Config
