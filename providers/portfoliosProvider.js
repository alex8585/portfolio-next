import { gql } from "@apollo/client";
import {initializeApollo} from '../apollo/client'

const client  = initializeApollo()

const PORTFOLIOS_QUERY = gql`
  query getPortfoliosList($perPage: Int, $page:Int, $order:String, $direction:String,, $filter:filterType) {
      total:totalPortfolios(filter:$filter)
      data:getPortfolios(perPage: $perPage, page: $page,order: $order, direction: $direction, filter:$filter) {
        id
        name
        img
        url
        createdTs
        tags {
          id
          name
        }
      }
  }
`
export const getList = async (perPage=6, page=1,  direction="", order="", filter={}) => {

    let { data } = await client.query({
        query: PORTFOLIOS_QUERY, 
        variables: { perPage, page, direction, order, filter},
    })

    let res = {
      ...data,
      perPage,
      page
    }

    return res;
}
