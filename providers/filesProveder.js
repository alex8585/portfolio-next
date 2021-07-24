import { gql } from "@apollo/client"
import { initializeApollo } from "../apollo/client"

const client = initializeApollo()

const EDIT_TAG_QUERY = gql`
  mutation EditTag($id: ID!, $name: String) {
    editTag(id: $id, name: $name) {
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

export const deleteTagRequest = async (id) => {
  let res = await client.query({
    query: DELETE_TAG_QUERY,
    variables: { id },
    fetchPolicy: "no-cache",
  })

  return res
}

export const editTagRequest = async (tag) => {
  const { id, name } = tag
  let res = await client.query({
    query: EDIT_TAG_QUERY,
    variables: { id, name },
    fetchPolicy: "no-cache",
  })

  return res
}
