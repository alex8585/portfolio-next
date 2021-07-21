import { gql } from "@apollo/client"
import { initializeApollo } from "../apollo/client"

const client = initializeApollo()

const TAGS_QUERY = gql`
  query getTagsList(
    $perPage: Int
    $page: Int
    $order: String
    $direction: String
    $filter: filterType
  ) {
    total: totalTags(filter: $filter)
    data: getTags(
      perPage: $perPage
      page: $page
      order: $order
      direction: $direction
      filter: $filter
    ) {
      id
      name
      createdTs
    }
  }
`

const CREATE_TAG_QUERY = gql`
  mutation CreateTagHandler($name: String) {
    createTag(name: $name)
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
    query: TAGS_QUERY,
    variables: { perPage, page, filter, order, direction },
    fetchPolicy: "no-cache",
  })

  let res = {
    ...data,
    perPage,
    page,
  }

  return res
}

export const createTag = async (values) => {
  const { name } = values
  let res = await client.query({
    query: CREATE_TAG_QUERY,
    variables: { name },
    fetchPolicy: "no-cache",
  })

  return res
}
