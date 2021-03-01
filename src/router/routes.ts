import { HasLoginBack } from "./middleware/author-check"
import { IsH5Check } from "./middleware/h5-check"

const routerMustLogin = (url: string, type: string = 'navigateTo') => {
    return {
        url,
        beforeRouteEnter: [HasLoginBack],
        ext: {
            checkLogin: true,
            type
        }
    }
}
export const routes = {
    houseComment: {
        url: '/house/new/comment/index'
    },
    houseDetail: {
        url: '/house/new/detail/index'
    },
    houseAsk: {
        url: '/house/new/ask/index'
    },
    houseAlbum: {
        url: '/house/new/album/index'
    },
    houseVideo: {
        url: '/house/new/video/index'
    },
    houseType: {
        url: '/house/new/type/index'
    },
    houseTypeDetail: {
        url: '/house/new/type/detail'
    },
    houseNews: {
        url: '/house/new/news/index'
    },
    houseSand: {
        url: '/house/new/sand/index'
    },
    houseSurround: {
        url: '/house/new/surround/index'
    },
    houseConsultant: {
        url: '/house/new/consultant/index'
    },
    houseAskForm: routerMustLogin('/house/new/askForm/index'),
    houseCommentForm: routerMustLogin('/house/new/commentForm/index'),

    chatRoom: {
        url: '/chat/room/index',
        beforeRouteEnter: [IsH5Check],
        ext: {
            checkH5: true
        }
    }
}
