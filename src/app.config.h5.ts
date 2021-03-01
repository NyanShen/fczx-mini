import { Config } from '@tarojs/taro';

export default {
  pages: [
    // 'activity/index',
    'pages/index/index',
    'pages/user/index'
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
  ]
} as Config
