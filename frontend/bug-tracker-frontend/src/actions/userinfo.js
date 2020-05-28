import {getUserInfo} from '../api/userinfo'
import { GET_USER_INFO_SUCCESS, GET_USER_INFO_FAILURE } from './actiontype'

const requestUserInfo = pk => {
    return dispatch => {
        getUserInfo(pk)
        .then(
            response => dispatch(fetchUserInfoSuccess(response.data)),
            error => dispatch(fetchUserInfoFailure(error) 
            )
        )
    }
} 

const fetchUserInfoSuccess = user_data => {
    return{
        type: GET_USER_INFO_SUCCESS,
        data: user_data
    }
}

const fetchUserInfoFailure = error => {
    return{
        type: GET_USER_INFO_FAILURE,
        error,
    }
}

export {requestUserInfo}