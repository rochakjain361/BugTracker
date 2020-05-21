import axios from 'axios'
import {APP_USERS_URL} from './constants'

export const fetchUserProfileApi = pk => {
    return axios.get(APP_USERS_URL + pk);
}

