export const API_URL = 'http://127.0.0.1:8000/'
export const APP_USERS_URL = API_URL + 'appusers/'
export const CURRENT_APP_USER_URL = APP_USERS_URL + 'current_user/current_user/'
export const PROJECTS_URL = API_URL + 'project/'
export const ISSUES_URL = API_URL + 'issues/'
export const COMMENT_URL = API_URL + 'comment/'
export const IMAGE_URL = API_URL + 'image/'
export const APP_USER_DETAILS_URL = pk => {
    return APP_USERS_URL + pk + '/';
}
export const PROJECT_DETAILS_URL = pk => {
    return PROJECTS_URL + pk + '/';
}
export const ISSUES_DETAILS_URL = pk => {
    return ISSUES_URL + pk + '/';
}
export const COMMENT_DETAILS_URL = pk => {
    return COMMENT_URL + pk + '/';
}
export const APP_USER_INFO_URL = pk => {
    return APP_USERS_URL + pk + '/user_info/' 
}
export const PROJECT_ISSUES_URL = pk => {
    return PROJECT_DETAILS_URL(pk) + 'issues/'
}
export const PROJECT_MEMBERS_URL = pk => {
    return PROJECT_DETAILS_URL(pk) + 'members/'
}
export const PROJECT_CREATOR_URL = pk => {
    return PROJECT_DETAILS_URL(pk) + 'creator/'
}
export const ISSUE_ASSIGN_URL = pk => {
    return ISSUES_DETAILS_URL(pk) + 'assign/'
}