import axios from "axios"
import { PROJECTS_URL } from "./urls"

export const getProjects = () => {
    return axios.get(PROJECTS_URL)
}