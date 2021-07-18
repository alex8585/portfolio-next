import {
  PORTFOLIO_LIST_REQUEST,
  PORTFOLIO_LIST_SUCCESS,
  PORTFOLIO_LIST_FAIL,
} from "../constants/portfolioConstants"


import { getList } from "../providers/portfoliosProvider.js"

export const setPortfolios = (portfolios,perPage,total) => async (dispatch) => {
    dispatch({
      type: PORTFOLIO_LIST_SUCCESS,
      payload: {
        page: 1,
        data:portfolios,
        total,
        perPage
      },
    })
}

export const listPortfolios =
  (page = "", perPage = "", tags = []) =>
  async (dispatch) => {
    let tagsIds = tags.filter((tag) => tag.active).map((tag) => tag.id)

    let filter = {}
    if (tagsIds.length) {
      filter = { tags: tagsIds.join(",") }
    }

    try {
      dispatch({ type: PORTFOLIO_LIST_REQUEST })

      let data = await getList(perPage,page,filter)
      
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
