import axios from "axios"
import { PROJECT_ISSUES_URL } from "./urls"

export const fetchProjectIssues = pk => {
    return axios.get(PROJECT_ISSUES_URL(pk))
}