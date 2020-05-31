import { FETCH_PROJECT_DETAILS_SUCCESS, FETCH_PROJECT_DETAILS_FAILURE } from "../actions/actiontype"

const initialstate = {
    data : null,
    error : null,
    loaded : false,
}

const project = (state = initialstate, action) => {
    switch(action.type) {
        case FETCH_PROJECT_DETAILS_SUCCESS:
            return{    
                data: action.data,
                error: null,
                loaded: true, 
            }
        case FETCH_PROJECT_DETAILS_FAILURE:
            return{
                ...initialstate,
                error: action.error
            }
        default:
            return initialstate
    }   
}
export default project