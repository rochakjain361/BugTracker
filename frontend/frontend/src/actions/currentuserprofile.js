import { fetchCurrentUserProfileApi } from '../api/currentuserprofile'
import {FETCH_CURRENT_USER_PROFILE_SUCCESS, FETCH_CURRENT_USER_PROFILE_FAILURE} from './actiontype'
function requestCurrentUserProfile() {
    return dispatch =>{
        fetchCurrentUserProfileApi()
        .then(
            response => dispatch(fetchCurrentUserProfileSuccess(response.data)),
            error => dispatch(fetchCurrentUserProfileError(error)
            )
        )
    }
}

const fetchCurrentUserProfileSuccess = profile_data => {
    return{
        type : FETCH_CURRENT_USER_PROFILE_SUCCESS,
        data : profile_data,
    }
}

const fetchCurrentUserProfileError = error => {
    return{
        type : FETCH_CURRENT_USER_PROFILE_FAILURE,
        error        
    }
}

export {requestCurrentUserProfile}