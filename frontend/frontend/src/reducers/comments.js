import { FETCH_COMMENT_DETAILS_SUCCESS, FETCH_COMMENT_DETAILS_FAILURE } from "../actions/actiontype";

const initialState = {
  data: null,
  error: null,
  loaded: false  
}

const comment = (state= initialState, action) => {
    switch (action.type) {
        case FETCH_COMMENT_DETAILS_SUCCESS:
            return{
                data: action.data,
                error: null,
                loaded: true,
            }
        case FETCH_COMMENT_DETAILS_FAILURE:
            return{
                ...initialState,
                error : action.error,
            }
        default:
            return initialState
    }
}

export default comment