import produce from "immer"
import {
  TAG_LIST_REQUEST,
  TAG_LIST_SUCCESS,
  TAG_LIST_FAIL,
  SET_ACTIVE_TAG,
} from "../constants/tagConstants"

const INITIAL_STATE = {
  data: [],
}
export const tagListReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAG:
      let id = action.payload
      let newData = draft.data.map((tag) => {
        if (tag.id === id) {
          tag.active = !tag.active
        }
        return tag
      })
      draft.data = newData
      break
    case TAG_LIST_REQUEST:
      draft.loding = true
      draft.data = []
      break
    case TAG_LIST_SUCCESS:
      console.log(action.payload.data)
      draft.loading = false
      draft.data = action.payload.data
      draft.pages = action.payload.pages
      draft.ipage = action.payload.page
      draft.total = action.payload.total
      draft.perPage = action.payload.perPage
      
      break
    case TAG_LIST_FAIL:
      draft.loading = false
      draft.error = "action.payload"
      break
    default:
      break
  }
  return
}, INITIAL_STATE)
