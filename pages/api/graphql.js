import { ApolloServer } from "apollo-server-micro"
import { schema } from "../../apollo/schema"
import dbConnect from "../../utils/dbConnect"
import { applyMiddleware } from "graphql-middleware"
import { shield, rule, and, or } from "graphql-shield"
await dbConnect()

export const config = {
  api: {
    bodyParser: false,
  },
}

const logResult = async (resolve, root, args, context, info) => {
  //console.log(`1. logInput: ${JSON.stringify(args)}`)
  // if (info.fieldName == "login") {
  //   return "777"
  // }

  const result = await resolve(root, args, context, info)
  //console.log(`4. logResult: ${JSON.stringify(result)}`)
  return result
}

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.user !== null
  }
)

const isAdmin = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    console.log(args)
    return true
  }
)

const permissions = shield({
  // Query: {
  //   login: isAdmin,
  // },
})

const schemaWithMiddleware = applyMiddleware(schema, permissions, logResult)

const apolloServer = new ApolloServer({
  schema: schemaWithMiddleware,
  formatError: (err) => {
    console.log(err)
    return err
  },
})
export default apolloServer.createHandler({ path: "/api/graphql" })
