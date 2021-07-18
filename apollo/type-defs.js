import { gql } from '@apollo/client'

export const typeDefs = gql`
  type Tag {
    id: ID!
    name: String
    createdAt:String
    updatedAt:String
  }

  type Portfolio {
    id: ID!
    name: String
    img: String
    url: String
    tags: [Tag]
  }
  

  input filterType  {
    tags: String,
   
  
}

  type Query {
    getPortfolios(perPage:Int = 6, page:Int = 1, filter: filterType ={} ): [Portfolio]
    totalPortfolios(filter: filterType = {}): Int
    getTags: [Tag!]
    totalTags: Int
  }
`
