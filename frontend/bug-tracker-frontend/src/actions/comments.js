import { fetchCommentsApi } from "../api/comments"
import { FETCH_COMMENT_DETAILS_SUCCESS, FETCH_COMMENT_DETAILS_FAILURE } from "./actiontype"

const requestCommentDetails = pk => {
    return dispatch =>{
        fetchCommentsApi(pk)
        .then(
            response => dispatch(fetchCommentSuccess(response.data)),
            error => dispatch(fetchCommentError(error)
            )
        )
    }
}

const fetchCommentSuccess = comment_data => {
    return{
        type : FETCH_COMMENT_DETAILS_SUCCESS,
        data : comment_data,
    }
}

const fetchCommentError = error => {
    return{
        type : FETCH_COMMENT_DETAILS_FAILURE,
        error        
    }
}

export {requestCommentDetails}