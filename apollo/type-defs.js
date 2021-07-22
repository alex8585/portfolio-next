import { gql } from "@apollo/client"

export const typeDefs = gql`
  type Tag {
    id: ID!
    name: String
    createdAt: String
    updatedAt: String
    createdTs: Float
  }

  type Portfolio {
    id: ID!
    name: String
    img: String
    url: String
    updatedAt: String
    createdTs: Float
    tags: [Tag]
  }

  type User {
    id: ID
    username: String
    email: String
    isAdmin: Boolean
    token: ID
    error: String
  }

  input filterType {
    tags: String
  }

  type Query {
    getPortfolios(
      perPage: Int = 6
      page: Int = 1
      direction: String = ""
      order: String = ""
      filter: filterType = {}
    ): [Portfolio]
    totalPortfolios(filter: filterType = {}): Int
    getTags(
      perPage: Int = 6
      page: Int = 1
      direction: String = ""
      order: String = ""
      filter: filterType = {}
    ): [Tag]
    totalTags(filter: filterType = {}): Int
    login(email: String, password: String): User
  }

  type Mutation {
    createTag(name: String): ID!
  }
`
