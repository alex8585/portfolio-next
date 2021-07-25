import { useMemo } from "react"
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { getUserTokenFromLocalStorage } from "../utils/utils"
import { createUploadLink } from "apollo-upload-client"
let apolloClient

const httpLink = createUploadLink({
  uri: "/api/graphql",
  headers: {
    "keep-alive": "true",
  },
})

const authLink = setContext((_, { headers }) => {
  let token = getUserTokenFromLocalStorage()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

function createIsomorphLink() {
  if (typeof window === "undefined") {
    console.log("error window undefined")
    // const { SchemaLink } = require("@apollo/client/link/schema")
    // const { schema } = require("./schema")
    // return new SchemaLink({ schema })
  } else {
    return authLink.concat(httpLink)
  }
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: createIsomorphLink(),
    cache: new InMemoryCache({
      addTypename: false,
    }),
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
