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
    ImagesOfComment: commentImages,
    UserComments: comment,
    currentprofile: currentUserProfile,
    CommentsOfIssue: issueComment,
    ToatalIssues: issues,
    CreatorOfProject: projectCreator,
    DetailsofProjects: projectDetails,
    issuesOfProject: projectIssues,
    MembersofProject: projectMembers,
    ProjectsRegistered: projects,
    InformationOfUser: userInfo,
    UsersRegistered: users
});

export default rootReducer
