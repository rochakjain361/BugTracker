import {FETCH_PROJECT_DETAILS_SUCCESS, FETCH_PROJECT_DETAILS_FAILURE} from '../actions/actiontype'

const initialState = {
    data: null,
    error: null,
    loaded: false
}

const projectDetails = (state = initialState, action) => {
    switch(action.type){
        case FETCH_PROJECT_DETAILS_SUCCESS:
            return{
                data: action.data,
                error: null,
                loaded: true
            }
        case FETCH_PROJECT_DETAILS_FAILURE:
            return{
                ...initialState,
                error: action.error,
            }
        default:
            return initialState
    }
}

export default projectDetails