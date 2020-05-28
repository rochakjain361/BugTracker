import {getProjects} from '../api/projects'
import { GET_PROJECTS_SUCCESS, GET_PROJECTS_FAILURE } from './actiontype'

const requestProjects = () => {
    return dispatch => {
        getProjects()
        .then(
            response => dispatch(fetchProjectsSuccess(response.data)),
            error => dispatch(fetchProjectsFailure(error))
        )
    }
}

const fetchProjectsSuccess = project_data => {
    return{
        type: GET_PROJECTS_SUCCESS,
        data: project_data 
    }
}

const fetchProjectsFailure = error => {
    return{
        type: GET_PROJECTS_FAILURE,
        error
    }
}

export {requestProjects}