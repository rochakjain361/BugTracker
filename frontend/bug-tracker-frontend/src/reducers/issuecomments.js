import {GET_ISSUE_COMMENT_SUCCESS, GET_ISSUE_COMMENT_FAILURE} from '../actions/actiontype'

const initialState = {
    data: null,
    error: null,
    loaded: false
}

const issueComment = (state = initialState, action) => {
    switch(action.type){
        case GET_ISSUE_COMMENT_SUCCESS:
            return{
                data: action.data,
                error: null,
                loaded: true
            }
        case GET_ISSUE_COMMENT_FAILURE:
            return{
                ...initialState,
                error: action.error,
            }
        default:
            return initialState
    }
}

export default issueComment