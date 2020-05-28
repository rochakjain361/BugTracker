import {GET_PROJECT_CREATOR_SUCCESS, GET_PROJECT_CREATOR_FAILURE} from '../actions/actiontype'

const initialState = {
    data: null,
    error: null,
    loaded: false
}

const projectCreator = (state = initialState, action) => {
    switch(action.type){
        case GET_PROJECT_CREATOR_SUCCESS:
            return{
                data: action.data,
                error: null,
                loaded: true
            }
        case GET_PROJECT_CREATOR_FAILURE: 
            return{
                ...initialState,
                error: action.error,
            }
        default:
            return initialState
    }
}

export default projectCreator