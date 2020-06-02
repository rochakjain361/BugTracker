import {combineReducers} from 'redux'
import commentImages from './commentimages'
import comment from './comments'
import currentUserProfile from './currentuserprofile'
import issueComment from './issuecomments'
import issues from './issues'
import projectCreator from './projectcreator'
import projectDetails from './projectdetails'
import projectIssues from './projectissues'
import projectMembers from './projectmembers'
import projects from './projects'
import userInfo from './userinfo'
import users from './users'

const rootReducer = combineReducers({
    commentImages,
    comment,
    currentProfile: currentUserProfile,
    issueComment,
    issues,
    projectCreator,
    projectDetails,
    projectIssues,
    projectMembers,
    projects,
    userInfo,
    users
});

export default rootReducer