import { gql } from "@apollo/client"
import { initializeApollo } from "../apollo/client"

const client = initializeApollo()

const PORTFOLIOS_QUERY = gql`
  query getPortfoliosList(
    $perPage: Int
    $page: Int
    $order: String
    $direction: String
    $filter: filterType
  ) {
    total: totalPortfolios(filter: $filter)
    data: getPortfolios(
      perPage: $perPage
      page: $page
      order: $order
      direction: $direction
      filter: $filter
    ) {
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

const CREATE_PORTFOLIO_QUERY = gql`
  mutation CreatePortfolioHandler(
    $img: String
    $name: String
    $url: String
    $tags: [tagInput]
    $order_number: String
  ) {
    createPortfolio(
      name: $name
      img: $img
      url: $url
      tags: $tags
      order_number: $order_number
    ) {
      error
      success
    }
  }
`

export const getList = async (
  perPage = 6,
  page = 1,
  direction = "",
  order = "",
  filter = {}
) => {
  let { data } = await client.query({
    query: PORTFOLIOS_QUERY,
    variables: { perPage, page, direction, order, filter },
    fetchPolicy: "no-cache",
  })

  let res = {
    ...data,
    perPage,
    page,
  }

  return res
}

export const createPortfolio = async (values) => {
  let res = await client.query({
    query: CREATE_PORTFOLIO_QUERY,
    variables: { ...values },
    fetchPolicy: "no-cache",
  })

  return res
}
