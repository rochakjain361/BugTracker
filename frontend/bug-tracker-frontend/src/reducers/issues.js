import { FETCH_ISSUES_DETAILS_SUCCESS, FETCH_ISSUES_DETAILS_FAILURE } from "../actions/actiontype"

const initailState = {
    data: null,
    error: null,
    loaded: false
}

const issues = (state = initailState, action) =>{
    switch(action.type) {
        case FETCH_ISSUES_DETAILS_SUCCESS:
            return{
                data: action.data,
                error: null,
                loaded: false,
            }
        case FETCH_ISSUES_DETAILS_FAILURE:
            return{
                ...initailState,
                error: action.error,
            }
        default:
            return initailState
    } 
}  

export default issues