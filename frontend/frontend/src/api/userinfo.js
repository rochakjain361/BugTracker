import axios from "axios"
import { APP_USER_INFO_URL } from "./urls"

export const getUserInfo = pk => {
    return axios.get(APP_USER_INFO_URL(pk))
}