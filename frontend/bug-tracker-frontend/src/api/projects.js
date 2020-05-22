import axios from 'axios'
import { PROJECT_DETAILS_URL } from './constants';

export const fetchProjectApi = pk => {
    return axios.get(PROJECT_DETAILS_URL(pk));
}
