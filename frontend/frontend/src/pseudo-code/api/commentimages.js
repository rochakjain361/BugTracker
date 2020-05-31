import Axios from "axios"
import { COMMENT_IMAGES } from "./urls"

export const getCommentImageApi = pk => {
    return Axios.get(COMMENT_IMAGES(pk))
}