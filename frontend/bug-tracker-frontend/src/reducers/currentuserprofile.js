import {FETCH_CURRENT_USER_PROFILE_FAILURE, FETCH_CURRENT_USER_PROFILE_SUCCESS } from "../actions/actiontype"

const initialState = {
    data: null,
    error: null,
    loaded: false
}

const currentUserProfile = (state = initialState, action) =>{
    switch(action.type) {
        case FETCH_CURRENT_USER_PROFILE_SUCCESS:
            return {
                data: action.data,
                error: null, 
                loaded: true  
            }
        case FETCH_CURRENT_USER_PROFILE_FAILURE:
            return {
                ...initialState,
                error: action.error,
            }
        default:
            return initialState    
    }   
}

export default currentUserProfile
