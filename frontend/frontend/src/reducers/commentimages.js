import {GET_COMMENT_IMAGES_SUCCESS, GET_COMMENT_IMAGES_FAILURE} from '../actions/actiontype'

const initialState = {
    data: null,
    error: null,
    loaded: false
}

const commentImages = (state = initialState, action) => {
    switch(action.type){
        case GET_COMMENT_IMAGES_SUCCESS:
            return{
                data: action.data,
                error: null,
                loaded: true
            }
        case GET_COMMENT_IMAGES_FAILURE:
            return{
                ...initialState,
                error: action.error,
            }
        default:
            return initialState
    }
}

export default commentImages