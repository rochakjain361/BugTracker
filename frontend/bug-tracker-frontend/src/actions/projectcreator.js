import {getProjectCreator} from '../api/projectcreator'
import { GET_PROJECT_CREATOR_SUCCESS, GET_PROJECT_CREATOR_FAILURE } from './actiontype'

export const requestProjectCreator = pk => {
    return dispatch => {
        getProjectCreator(pk)
        .then(
            response => dispatch(fetchProjectCreatorSuccess(response.data)),
            error => dispatch(fetchProjectCreatorFailure(error())
            )
        )
    }
}

const fetchProjectCreatorSuccess = project_data => {
    return{
        type: GET_PROJECT_CREATOR_SUCCESS,
        data: project_data
    }
}

const fetchProjectCreatorFailure = error => {
    return{
        type: GET_PROJECT_CREATOR_FAILURE,
        error
    }
}

export {requestProjectCreator}