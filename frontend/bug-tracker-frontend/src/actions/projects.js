import { fetchProjectApi } from "../api/projects"
import { FETCH_PROJECT_DETAILS_SUCCESS, FETCH_PROJECT_DETAILS_FAILURE } from "./actiontype"

const requestProjectDetails = pk => {
    return dispatch =>{
        fetchProjectApi(pk)
        .then(
            response => dispatch(fetchProjectSuccess(response.data)),
            error => dispatch(fetchProjectError(error)
            )
        )
    }
}

const fetchProjectSuccess = project_data => {
    return{
        type : FETCH_PROJECT_DETAILS_SUCCESS,
        data : project_data,
    }
}

const fetchProjectError = error => {
    return{
        type : FETCH_PROJECT_DETAILS_FAILURE,
        error        
    }
}

export {requestProjectDetails}