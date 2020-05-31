import {GET_USER_INFO_SUCCESS, GET_USER_INFO_FAILURE} from '../actions/actiontype'

const initialState = {
    data: null,
    error: null,
    loaded: false
}

const userInfo = (state = initialState, action) => {
    switch(action.type){
        case GET_USER_INFO_SUCCESS:
            return{
                data: action.data,
                error: null,
                loaded: true
            }
        case  GET_USER_INFO_FAILURE:
            return{
                ...initialState,
                error: action.error,
            }
        default:
            return initialState
    }
}

export default userInfo