import produce from "immer"
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
} from "../constants/userConstants"

const INITIAL_STATE = {
  loading: false,
  user: {},
  error: null,
}
export const userReducer = produce((draft, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      draft.loading = true
      draft.user = {}
      break
    case USER_LOGIN_SUCCESS:
      draft.loading = false
      draft.error = null
      draft.user = action.payload
      break
    case USER_LOGIN_FAIL:
      draft.loading = false
      draft.error = action.payload
      break
    default:
      break
  }
  return
}, INITIAL_STATE)
