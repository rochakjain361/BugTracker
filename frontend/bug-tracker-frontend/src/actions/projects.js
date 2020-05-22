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
        name : project_data.name,
        status : project_data.status,
    }
}

const fetchProjectError = error => {
    return{
        type : FETCH_PROJECT_DETAILS_FAILURE,
        error        
    }
}

export {requestProjectDetails}