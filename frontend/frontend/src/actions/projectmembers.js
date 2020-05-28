import {getProjectMembers} from '../api/projectmembers'
import { GET_PROJECT_MEMBERS_SUCCESS, GET_PROJECT_MEMBERS_FAILURE } from './actiontype'

const fetchProjectMembers = pk => {
    return dispatch => {
        getProjectMembers(pk)
        .then(
            response => dispatch(fetchProjectMembersSuccess(response.data)),
            error => dispatch(fetchProjectMembersFailure(error)
            )
        )
    }
}

const fetchProjectMembersSuccess = member_data => {
    return{
        type: GET_PROJECT_MEMBERS_SUCCESS,
        data: member_data
    }
}
 
const fetchProjectMembersFailure = error => {
    return{
        type: GET_PROJECT_MEMBERS_FAILURE,
        error
    }
}

export {fetchProjectMembers}