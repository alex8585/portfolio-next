import { getList } from "../providers/frontendProvider.js"

import {
  TAG_LIST_REQUEST,
  TAG_LIST_SUCCESS,
  TAG_LIST_FAIL,
  SET_ACTIVE_TAGS
} from "../constants/tagConstants"

export const filterByTags = (tags) => (dispatch) => {
    dispatch({
      type: SET_ACTIVE_TAGS,
      payload: tags,
    })
}

export const setTags = (data) => async (dispatch) => {
    if(!data) return
    await dispatch({
        type: TAG_LIST_SUCCESS,
        payload: {
          data:data
        }
    })
}



export const listTags =
  (page = "", perPage = "") =>
  async (dispatch) => {
    //console.log('1111')
    try {
      dispatch({ type: TAG_LIST_REQUEST })
      let params = {
        perPage,
        page,
      }
      let { data } = await getList("tags", params)
      //console.log(data )
      dispatch({
        type: TAG_LIST_SUCCESS,
        payload: data  }
      )
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
