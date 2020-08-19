import { ADD } from '../constants/counter'

export const add = () => {
    return { type: ADD }
}

export function asyncAdd() {
    return dispatch => {
        setTimeout(() => {
            dispatch(add())
        }, 2000)
    }
}