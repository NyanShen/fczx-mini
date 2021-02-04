import { Config } from '@tarojs/taro';

export default {
  pages: [
    // 'activity/index',
    'pages/index/index',
    'pages/user/index',
    'pages/chat/index',
    'pages/discover/index',
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
        'group/index',

        'esf/index/index',
        'esf/list/index',
        'esf/search/index',

        'rent/index/index',
        'rent/list/index',
        'rent/search/index',

        'community/index/index',
        'community/list/index',
        'community/search/index',

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
      root: 'user',
      pages: [
        'member/index',
        'collect/index',
        'official/index',
        'profile/index',
        'consultant/index',

        'house/sale/index',
        'house/list/index',
      ]
    },
    {
      root: 'calculator',
      pages: [
        'index'
      ]
    },
    {
      root: 'consultant',
      pages: [
        'release/index',
        'dynamic/index',
        'register/index',
        'checkStatus/index',
        'houseSearch/index',
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
        pagePath: 'pages/index/index',
        iconPath: './assets/icons/home.png',
        selectedIconPath: './assets/icons/home_hv.png',
        text: '首页'
      },
      {
        pagePath: 'pages/chat/index',
        iconPath: './assets/icons/chat.png',
        selectedIconPath: './assets/icons/chat_hv.png',
        text: '微聊'
      },
      {
        pagePath: 'pages/discover/index',
        iconPath: './assets/icons/discover.png',
        selectedIconPath: './assets/icons/discover_hv.png',
        text: '发现'
      },
      {
        pagePath: 'pages/user/index',
        iconPath: './assets/icons/user.png',
        selectedIconPath: './assets/icons/user_hv.png',
        text: '我的'
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
