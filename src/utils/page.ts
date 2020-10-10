export interface IPage {
    totalCount: number
    totalPage: number
}

export const INIT_PAGE: IPage = {
    totalCount: 0,
    totalPage: 0
}

export const getTotalPage = (limit: number, totalCount: number) => {
    return Math.ceil(totalCount / limit)
}