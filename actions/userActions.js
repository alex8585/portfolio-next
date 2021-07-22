import { login } from "../providers/userProvider"

import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
} from "../constants/userConstants"

export const loginAttempt = (values) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST })

    const { email, password } = values

    let { data } = await login(email, password)

    if (!data.login.error) {
      let token = data.login.token
      localStorage.setItem("token", token)

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data.login,
      })
    } else {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: data.login.error,
      })
    }
  } catch (error) {
    let msg = ""
    if (typeof error === "string") {
      msg = error
    } else {
      msg =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    }

    dispatch({
      type: USER_LOGIN_FAIL,
      payload: msg,
    })
  }
}
