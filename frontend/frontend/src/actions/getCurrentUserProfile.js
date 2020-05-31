import {GET_CURRENT_USER_PROFILE} from '../constants/actiontypes'

export const getCurrentUser = () => {
    return dispatch => {
        fetch('http://127.0.0.1:8000/appusers/current_user/current_user/')
        .then(res => {
            dispatch({
                type: GET_CURRENT_USER_PROFILE,
                payload: res.data
            });
        })
        .catch(error => {})
    }
}  