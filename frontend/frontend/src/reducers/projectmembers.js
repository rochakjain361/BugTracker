import {GET_PROJECT_MEMBERS_SUCCESS, GET_PROJECT_MEMBERS_FAILURE} from '../actions/actiontype'

const initialState = {
    data: null,
    error: null,
    loaded: false
}

const projectMembers = (state = initialState, action) => {
    switch(action.type){
        case GET_PROJECT_MEMBERS_SUCCESS:
            return{
                data: action.data,
                error: null,
                loaded: true
            }
        case GET_PROJECT_MEMBERS_FAILURE:
            return{
                ...initialState,
                error: action.error,
            }
        default:
            return initialState
    }
}

export default projectMembers