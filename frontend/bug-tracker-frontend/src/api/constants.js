export const API_URL = 'http://127.0.0.1:8000/'
export const APP_USERS_URL = API_URL + 'appusers/'
export const PROJECTS_URL = API_URL + 'project/'
export const ISSUES_URL = API_URL + 'issues/'
export const COMMENT_URL = API_URL + 'comment/'
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