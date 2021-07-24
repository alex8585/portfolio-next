import { ApolloServer } from "apollo-server-micro"
//import { schema } from "../../apollo/schema"
import { applyMiddleware } from "graphql-middleware"
import invariant from "tiny-invariant"
invariant(1111, "This should not throw!")
import { typeDefs } from "../../apollo/type-defs"
import { resolvers } from "../../apollo/resolvers"
import {
  GraphQLUpload,
  graphqlUploadExpress,
  graphqlUploadKoa,
} from "graphql-upload"
import express from "express"
import setUser from "../../middleware/graphql/setUser"
import permissions from "../../middleware/graphql/permissions"
import mongoose from "../../middleware/mongoose.js"
import bodyParser from "body-parser"
import Koa from "koa"
import { processRequest } from "graphql-upload"
var fileupload = require("express-fileupload")

const expressApp = express()

export const config = {
  api: {
    bodyParser: false,
  },
}

//const schemaWithMiddleware = applyMiddleware(schema, setUser)
const app = new Koa().use(
  graphqlUploadKoa({
    // Limits here should be stricter than config for surrounding
    // infrastructure such as Nginx so errors can be handled elegantly by
    // `graphql-upload`:
    // https://github.com/jaydenseric/graphql-upload#type-processrequestoptions
    maxFileSize: 10000000, // 10 MB
    maxFiles: 20,
  })
)

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  // introspection: true,
  // playground: true,
  uploads: false,
  formatError: (err) => {
    console.log(err)
    return err
  },
  context: ({ req }) => {
    req.query["aaaa"] = "333"
    let token = req.headers.authorization || ""
    if (token) {
      token = req.headers.authorization.split(" ")[1]
    }
    return { token }
  },
})
await apolloServer.start()

let apolloHandler = await apolloServer.createHandler({ path: "/api/graphql" })

//expressApp.use(bodyParser.urlencoded({ extended: false }))
//expressApp.use()
//expressApp.use(fileupload())
//expressApp.use(mongoose())
//expressApp.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))
//expressApp.use(apolloHandler)
export default async (req, res) => {
  const contentType = req.headers["content-type"]
  if (contentType && contentType.startsWith("multipart/form-data")) {
    req.filePayload = await processRequest(req, res)
  }
  return apolloHandler(req, res)
}
//export default apolloHandler
