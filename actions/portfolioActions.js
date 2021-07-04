import { getList } from "../providers/frontendProvider.js"
import {
  PORTFOLIO_LIST_REQUEST,
  PORTFOLIO_LIST_SUCCESS,
  PORTFOLIO_LIST_FAIL,
} from "../constants/portfolioConstants"


export const listPortfolios =
  (page = "", perPage = "", tags = []) =>
  async (dispatch) => {
    let tagsIds = tags.filter((tag) => tag.active).map((tag) => tag.id)

    let filter = ""
    if (tagsIds.length) {
      filter = { tags: tagsIds.join(",") }
      filter = JSON.stringify(filter)
    }

    try {
      dispatch({ type: PORTFOLIO_LIST_REQUEST })
      let params = {
        perPage,
        page,
        filter,
      }

      let { data } = await getList("portfolios", params)

      dispatch({
        type: PORTFOLIO_LIST_SUCCESS,
        payload: data,
      })
      
    } catch (error) {
      dispatch({
        type: PORTFOLIO_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

  
export default listPortfolios
