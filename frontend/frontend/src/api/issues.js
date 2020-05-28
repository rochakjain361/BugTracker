import axios from 'axios'
import { ISSUES_DETAILS_URL } from './constants'

export const fetchIssuesApi = pk => {
    return axios.get(ISSUES_DETAILS_URL(pk))
} 