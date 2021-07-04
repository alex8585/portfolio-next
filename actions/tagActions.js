import { getList } from "../providers/frontendProvider.js"

import {
  TAG_LIST_REQUEST,
  TAG_LIST_SUCCESS,
  TAG_LIST_FAIL,
  SET_ACTIVE_TAG,
} from "../constants/tagConstants"

export const filterByTags = (id) => async (dispatch) => {
  try {
    dispatch({
      type: SET_ACTIVE_TAG,
      payload: id,
    })
  } catch (error) {}
}

export const listTags =
  (page = "", perPage = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: TAG_LIST_REQUEST })
      let params = {
        perPage,
        page,
      }
      let { data } = await getList("tags", params)

      dispatch({
        type: TAG_LIST_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: TAG_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }
