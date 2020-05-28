import {getCommentImageApi} from '../api/commentimages'
import { GET_COMMENT_IMAGES_SUCCESS, GET_COMMENT_IMAGES_FAILURE } from './actiontype'

const requestCommentImages = pk => {
    return dispatch =>{
        getCommentImageApi(pk)
        .then(
            response => dispatch(getCommentImageSucces(response.data)),
            error => dispatch(getCommentImageFailure(error())
            )
        )
    }
}
const getCommentImageSucces = image_data => {
    return{
        type: GET_COMMENT_IMAGES_SUCCESS,
        data: image_data
    }
}

const getCommentImageFailure = error => {
    return{
        type: GET_COMMENT_IMAGES_FAILURE,
        error
    }
}

export {requestCommentImages}