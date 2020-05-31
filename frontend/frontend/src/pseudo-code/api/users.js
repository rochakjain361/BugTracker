import axios from 'axios'
import { APP_USERS_URL } from './urls'

export const getUsersApi = () => {
    return axios.get(APP_USERS_URL)
}