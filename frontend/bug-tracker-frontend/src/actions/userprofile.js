import {
    FETCH_USER_PROFILE_SUCCESS,
    FETCH_USER_PROFILE_FAILURE,    
} from './actiontype'
import { fetchUserProfileApi } from '../api/userprofile'

const requestUserProfile = pk => {
    return dispatch =>{
        fetchUserProfileApi(pk)
        .then(
            response => dispatch(fetchUserProfileSucces(response.data)),
            error => dispatch(fetchUserProfileError(error)
            )
        )
    }
}

const fetchUserProfileSucces = data => {
    return{
        type : FETCH_USER_PROFILE_SUCCESS,
        profile : data.json(),
    }
}

const fetchUserProfileError = error => {
    return{
        type : FETCH_USER_PROFILE_FAILURE,
        error        
    }
}

export {requestUserProfile}