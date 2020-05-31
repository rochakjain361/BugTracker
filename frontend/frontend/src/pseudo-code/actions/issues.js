import { fetchIssuesApi } from "../api/issues"
import { FETCH_ISSUES_DETAILS_SUCCESS, FETCH_ISSUES_DETAILS_FAILURE } from "./actiontype"

const requestIssueDetails = pk => {
    return dispatch =>{
        fetchIssuesApi(pk)
        .then(
            response => dispatch(fetchIssueSuccess(response.data)),
            error => dispatch(fetchIssueError(error)
            )
        )
    }
}

const fetchIssueSuccess = issue_data => {
    return{
        type : FETCH_ISSUES_DETAILS_SUCCESS,
        data : issue_data,
    }
}

const fetchIssueError = error => {
    return{
        type : FETCH_ISSUES_DETAILS_FAILURE,
        error        
    }
}

export {requestIssueDetails}