import axios from "axios"
import { PROJECT_MEMBERS_URL } from "./urls"

export const getProjectMembers = pk => {
    return axios.get(PROJECT_MEMBERS_URL(pk))
}
