import { ApolloServer } from "apollo-server-micro"
import { schema } from "../../apollo/schema"
import { applyMiddleware } from "graphql-middleware"
import invariant from "tiny-invariant"
invariant(1111, "This should not throw!")

import { GraphQLUpload, graphqlUploadExpress } from "graphql-upload"
import express from "express"
import setUser from "../../middleware/graphql/setUser"
import permissions from "../../middleware/graphql/permissions"
import mongoose from "../../middleware/mongoose.js"

const expressApp = express()

export const config = {
  api: {
    bodyParser: false,
  },
}

const schemaWithMiddleware = applyMiddleware(schema, setUser, permissions)

const apolloServer = new ApolloServer({
  schema: schemaWithMiddleware,
  formatError: (err) => {
    console.log(err)
    return err
  },
  context: ({ req }) => {
    let token = req.headers.authorization || ""
    if (token) {
      token = req.headers.authorization.split(" ")[1]
    }
    return { token }
  },
})
await apolloServer.start()

let apoloHandler = await apolloServer.createHandler({ path: "/api/graphql" })

expressApp.use(mongoose())
expressApp.use(graphqlUploadExpress())
expressApp.use(apoloHandler)

export default expressApp
