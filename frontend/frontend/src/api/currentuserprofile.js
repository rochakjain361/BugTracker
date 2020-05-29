import axios from 'axios'
import { CURRENT_APP_USER_URL } from './urls'

export function fetchCurrentUserProfileApi() {
    return axios.get(CURRENT_APP_USER_URL())    
}   

