import { combineReducers } from 'redux'
import getCurrentUserProfile from './getCurrentUserProfile'

const rootReducers = combineReducers({
    getCurrentUser: getCurrentUserProfile,
})

export default rootReducers;