 import axios from 'axios'
import { COMMENT_DETAILS_URL } from './constants'

 export const fetchCommentsApi = pk => {
     return axios.get(COMMENT_DETAILS_URL(pk));
 }