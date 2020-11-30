export default {
    getUserVerifyCode: '/user/login-code',
    loginByPassword: '/user/login-by-password',
    loginByVerifyCode: '/user/login-by-code',
    getSessionKeyByCode: '/applet/get-session',
    decryptData: '/applet/decrypt-data',
    getUserData: '/user/get',
    getCommonVerifyCode: '/common/send-code',

    getTestData: '/test/test',
    getCityList: '/index/city-list',
    getAreaList: '/area/list',

    getHouseList: '/house/list',
    getHouseMap: '/house/area-house',
    getHouseSearchHot: '/house/hot-search',
    getHouseById: '/house/get',
    getHouseAttr: '/house/attr',
    getHouseAlbum: '/house/all-image',
    getHouseSand: '/house/get-sand',
    getHouseSandRoom: '/house/find-sand-room',
    getHouseAsk: '/house/ask-list',
    postHouseAsk: '/house/ask',
    getHouseComment: '/house/comment-list',
    postHouseComment: '/house/comment',
    getHouseTypeList: '/house/room-list',
    getHouseTypeDetail: '/house/room-detail',
    getHouseConsultantList: '/house/consultant-list',
    postHouseCustomer: '/house/customer',

    getEsfList: '/esf/list',
    getEsfById: '/esf/get',
    getEsfSelfById: '/esf/get-self', //修改出售获取房源
    getEsfSaleList: '/esf/user-sale-list',
    esfSale: '/esf/sale',
    esfDelete: '/esf/delete',
    esfUpdate: '/esf/update',

    getRentList: '/rent/list',
    getRentById: '/rent/get',
    getRentSelfById: '/rent/get-self',
    getRentSaleList: '/rent/user-rent-list',
    rentAdd: '/rent/add',
    rentDelete: '/rent/delete',
    rentUpdate: '/rent/update',


    getCommunityList: '/community/list',
    getCommunityById: '/community/get',
    searchCommunity: '/community/find-by-title',

    getNewsById: '/news/get',
    getNewsList: '/news/list',
    getNewsCateList: '/news/cate-list',

    getChatDialog: '/chat/dialog',
    getChatRead: '/chat/read',
    postChatSend: '/chat/send',
    getUnread: '/chat/get-to-read',
    getChatData: '/chat/chat-data',
    getChatUser: '/chat/scan-chat'
}