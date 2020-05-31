import {GET_USERS_SUCCESS, GET_USERS_FAILURE} from '../actions/actiontype'

const initialState = {
    data: null,
    error: null,
    loaded: false
}

const users = (state = initialState, action) => {
    switch(action.type){
        case GET_USERS_SUCCESS:
            return{
                data: action.data,
                error: null,
                loaded: true
            }
        case GET_USERS_FAILURE:
            return{
                ...initialState,
                error: action.error,
            }
        default:
            return initialState
    }
}

export default users