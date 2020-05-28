import axios from "axios"
import { PROJECT_CREATOR_URL } from "./urls"

export const getProjectCreator = pk => {
    return axios.get(PROJECT_CREATOR_URL(pk))
} 