export function API_URL()  {
    return 'http://127.0.0.1:8000/' }
//
export function APP_USERS_URL() { 
    return `${API_URL}appusers/`
}
//
export function CURRENT_APP_USER_URL() { 
    return `${APP_USERS_URL}current_user/current_user/`
}
//
export function PROJECTS_URL() {
    return `${API_URL}project/`}

export function ISSUES_URL() {
    return `${API_URL}issues/`
}

export function COMMENT_URL() { 
    return `${API_URL}comment/`
}

export function IMAGE_URL() { 
    return `${API_URL}image/`
} 

export const APP_USER_DETAILS_URL = pk => {
    return APP_USERS_URL + pk + '/';
}
//
export const PROJECT_DETAILS_URL = pk => {
    return PROJECTS_URL + pk + '/';
}
//
export const ISSUES_DETAILS_URL = pk => {
    return ISSUES_URL + pk + '/';
}
//
export const COMMENT_DETAILS_URL = pk => {
    return COMMENT_URL + pk + '/';
}
//
export const APP_USER_INFO_URL = pk => {
    return APP_USERS_URL + pk + '/user_info/' 
}
//
export const PROJECT_ISSUES_URL = pk => {
    return PROJECT_DETAILS_URL(pk) + 'issues/'
}
//
export const PROJECT_MEMBERS_URL = pk => {
    return PROJECT_DETAILS_URL(pk) + 'members/'
}
//
export const PROJECT_CREATOR_URL = pk => {
    return PROJECT_DETAILS_URL(pk) + 'creator/'
}
//Assign Issue >> Using Patch 
export const ISSUE_ASSIGN_URL = pk => {
    return ISSUES_DETAILS_URL(pk) + 'assign/'
}
//
export const ISSUE_COMMENTS_URL = pk => {
    return ISSUES_DETAILS_URL(pk) + 'comments/'
}
//
export const COMMENT_IMAGES = pk => {
    return COMMENT_DETAILS_URL(pk) + 'images/'
}
