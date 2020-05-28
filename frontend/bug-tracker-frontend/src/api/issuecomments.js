import Axios from "axios"
import { ISSUE_COMMENTS_URL } from "./urls"

export const GET_ISSUE_COMMENTS = pk => {
    return Axios.get(ISSUE_COMMENTS_URL(pk))
}