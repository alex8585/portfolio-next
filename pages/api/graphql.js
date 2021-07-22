import { ApolloServer } from "apollo-server-micro"
import { schema } from "../../apollo/schema"
import dbConnect from "../../utils/dbConnect"
import { applyMiddleware } from "graphql-middleware"
import { shield, rule, and, or } from "graphql-shield"
import jwt from "jsonwebtoken"
import User from "../../models/userModel.js"
await dbConnect()

export const config = {
  api: {
    bodyParser: false,
  },
}

const setUser = async (resolve, root, args, ctx, info) => {
  let token = ctx.token

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded && decoded.id) {
      let user = null
      try {
        user = await User.findById(decoded.id).select("-password")
      } catch (e) {
        console.log(e)
      }

      if (user && user.id) {
        ctx.user = user
      }
    }
  }

  const result = await resolve(root, args, ctx, info)
  return result
}

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    if (ctx.user.id) {
      return true
    }
    return false
  }
)

const isAdmin = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    if (ctx.user.isAdmin) {
      return true
    }
    return false
  }
)

const permissions = shield({
  Query: {
    getTags: and(isAuthenticated, isAdmin),
  },
})

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
export default apolloServer.createHandler({ path: "/api/graphql" })
