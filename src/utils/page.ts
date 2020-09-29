export interface IPage {
    currentPage: number
    totalCount: number
    totalPage: number
}

export const INIT_PAGE: IPage = {
    currentPage: 1,
    totalCount: 0,
    totalPage: 0
}

export const getTotalPage = (limit: number, totalCount: number) => {
    return Math.ceil(totalCount / limit)
}