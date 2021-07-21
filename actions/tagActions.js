import { getList, createTag } from "../providers/tagsProvider.js"

import {
  TAG_LIST_SUCCESS,
  SET_ACTIVE_TAGS,
  TAG_LIST_REQUEST,
  TAG_LIST_FAIL,
} from "../constants/tagConstants"

export const filterByTags = (tags) => (dispatch) => {
  dispatch({
    type: SET_ACTIVE_TAGS,
    payload: tags,
  })
}

export const setTags = (data, total) => async (dispatch) => {
  if (!data) return
  await dispatch({
    type: TAG_LIST_SUCCESS,
    payload: {
      data: data,
      total,
    },
  })
}

export const getTags =
  (page = "", perPage = "", direction = "", order = "", filter = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: TAG_LIST_REQUEST })
      let data = await getList(perPage, page, direction, order, filter)
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

export const createNewTag = (values) => async (dispatch) => {
  try {
    let res = await createTag(values)
    return res
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
