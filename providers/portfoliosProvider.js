import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache()
});

const PORTFOLIOS_QUERY = gql`
  query getPortfoliosList($perPage: Int, $page:Int,$filter:filterType) {
      total:totalPortfolios(filter:$filter)
      data:getPortfolios(perPage: $perPage, page: $page,filter:$filter) {
        id
        name
        img
        url
        tags {
          id
          name
        }
      }
  }
`
export const getList = async (perPage=6, page=1, filter={}) => {

    let { data } = await client.query({
        query: PORTFOLIOS_QUERY, 
        variables: { perPage, page, filter},
    })

    let res = {
      ...data,
      perPage,
      page
    }

    return res;
}
