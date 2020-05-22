import axios from 'axios'
import  {APP_USER_DETAILS_URL} from './constants'

export const fetchUserProfileApi = pk => {
    return axios.get(APP_USER_DETAILS_URL(pk));
}

