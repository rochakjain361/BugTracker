import {fetchProjectIssues} from '../api/projectissues'
import { GET_PROJECT_ISSUES_SUCCESS, GET_PROJECT_ISSUES_FAILURE } from './actiontype'

const requestProjectIssues = pk => {
    return dispatch => {
        fetchProjectIssues(pk)
        .then(
            response => dispatch(fetchProjectIssuesSuccess(response.data)),
            error => dispatch(fetchProjectIssuesFailure(error)
            )
        )
    }
}

export const fetchProjectIssuesSuccess = issues_data => {
    return {
        type: GET_PROJECT_ISSUES_SUCCESS,
        data: issues_data
    }
}

export const fetchProjectIssuesFailure = error => {
    return {
        type: GET_PROJECT_ISSUES_FAILURE,
        error
    }
} 

export {requestProjectIssues}