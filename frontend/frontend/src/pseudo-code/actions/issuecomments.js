import {GET_ISSUE_COMMENTS}  from '../api/issuecomments'
import { GET_ISSUE_COMMENT_SUCCESS, GET_ISSUE_COMMENT_FAILURE } from './actiontype'

export const getIssueComments = pk =>{
    return dispatch => {
        GET_ISSUE_COMMENTS(pk)
        .then(
            response => dispatch(getIssueCommentSuccess(response.data)),
            error => dispatch(getIssueCommentFailure(error))
        )
    }   
}

const getIssueCommentSuccess = comment_data => {
    return{
        type: GET_ISSUE_COMMENT_SUCCESS,
        data: comment_data 
    }
}

const getIssueCommentFailure = error => {
    return{
        type: GET_ISSUE_COMMENT_FAILURE,
        error
    }
}

export {getIssueComments}