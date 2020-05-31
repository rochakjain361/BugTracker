import {GET_CURRENT_USER_PROFILE} from '../constants/actiontypes';

const getCurrentUSerProfile = (state = { isFetching : true}, action) => {
    switch (action.type) {
        case GET_CURRENT_USER_PROFILE:
            return { ...action.payload, isFetching: false}
        default:
            return state;
    }
};

export default getCurrentUSerProfile;