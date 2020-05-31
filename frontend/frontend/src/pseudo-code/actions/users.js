import {getUsersApi} from '../api/users'
import { GET_USERS_SUCCESS, GET_USERS_FAILURE } from './actiontype'
 
const requestUsers = () => {
    return dispatch => {
        getUsersApi()
        .then(
            response => dispatch(fetchUserSuccess(response.data)),
            error => dispatch(fetchUserFailure(error))
        )
    }
}

const fetchUserSuccess = users_data => {
    return{
        type: GET_USERS_SUCCESS,
        data: users_data
    }
}

const fetchUserFailure = error => {
    return{
        type: GET_USERS_FAILURE,
        error
    }
}

export {requestUsers}