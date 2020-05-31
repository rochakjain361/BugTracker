import {GET_PROJECT_ISSUES_SUCCESS, GET_PROJECT_ISSUES_FAILURE} from '../actions/actiontype'

const initialState = {
    data: null,
    error: null,
    loaded: false
}

const projectIssues = (state = initialState, action) => {
    switch(action.type){
        case GET_PROJECT_ISSUES_SUCCESS:
            return{
                data: action.data,
                error: null,
                loaded: true
            }
        case GET_PROJECT_ISSUES_FAILURE:
            return{
                ...initialState,
                error: action.error,
            }
        default:
            return initialState
    }
}

export default projectIssues