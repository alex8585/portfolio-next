import Portfolio from "../models/portfolioModel.js"
import Tag from "../models/tagModel.js"
import User from "../models/userModel.js"
import { generateToken } from "../utils/utils.js"
import mongoose from "mongoose"
function getFilterObj(filter) {
  let filterObj = {}

  if (filter && filter.tags) {
    let tagsFilter = filter.tags.split(",")
    filterObj["tags"] = { $in: tagsFilter }
  }
  return filterObj
}

export const resolvers = {
  Query: {
    async getTags(parent, args, context, info) {
      const { perPage, filter, page, direction, order } = args
      const skip = perPage * (page - 1)

      let sortObj = {}
      if (order && direction) {
        let newOrder = order
        if (newOrder == "id") {
          newOrder = "_id"
        }
        sortObj[newOrder] = direction
      } else {
        sortObj = { order_number: 1 }
      }

      const filterObj = getFilterObj(filter)
      let data = await Tag.find(filterObj)
        .limit(perPage)
        .skip(skip)
        .sort(sortObj)
      return data
    },

    async totalTags(parent, args, context, info) {
      const { filter } = args
      const filterObj = getFilterObj(filter)

      const total = await Tag.countDocuments(filterObj)
      return total
    },

    async getPortfolios(parent, args, context, info) {
      const { perPage, filter, page, direction, order } = args
      const skip = perPage * (page - 1)

      let sortObj = {}
      if (order && direction) {
        let newOrder = order
        if (newOrder == "id") {
          newOrder = "_id"
        }
        sortObj[newOrder] = direction
      } else {
        sortObj = { order_number: 1 }
      }

      const filterObj = getFilterObj(filter)

      const data = await Portfolio.find(filterObj)
        .populate("tags")
        .limit(perPage)
        .skip(skip)
        .sort(sortObj)
      return data
    },

    async totalPortfolios(parent, args, context, info) {
      const { filter } = args
      const filterObj = getFilterObj(filter)

      const total = await Portfolio.countDocuments(filterObj)
      return total
    },

    async login(parent, args, context, info) {
      const { email, password } = args
      const user = await User.findOne({ email })
      //console.log(user)
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user.id)
        const { id, username, email, isAdmin } = user
        return {
          id,
          username,
          email,
          isAdmin,
          token,
          error: null,
        }
      } else {
        return {
          error: "Invalid email or password",
        }
      }
    },
  },

  Mutation: {
    async createTag(parent, args, context, info) {
      const { name } = args
      const tag = await Tag.create({ name })
      return tag.id
    },
    async deleteTag(parent, args, context, info) {
      const { id } = args

      const result = await Tag.deleteOne({ _id: id })

      if (result.deletedCount) {
        return {
          error: null,
          success: true,
        }
      }

      return {
        error: "Something went wrong",
        success: false,
      }
    },

    async editTag(parent, args, context, info) {
      const { id, name } = args
      const result = await Tag.updateOne({ _id: id }, { name })
      if (result.ok) {
        return {
          error: null,
          success: true,
        }
      }

      return {
        error: "Something went wrong",
        success: false,
      }
    },
    async createPortfolio(parent, args, context, info) {
      const { tags } = args

      let tagsIds = tags.map((e) => {
        return e.id
      })
      let insert = {
        ...args,
        tags: tagsIds,
      }
      let result
      try {
        result = await Portfolio.create(insert)
      } catch (e) {
        console.log(e)
      }
      if (result._id) {
        return {
          error: null,
          success: true,
        }
      }
      return {
        error: "Something went wrong",
        success: false,
      }
    },
    async deletePortfolio(parent, args, context, info) {
      const { id } = args

      const result = await Portfolio.deleteOne({ _id: id })

      if (result.deletedCount) {
        return {
          error: null,
          success: true,
        }
      }

      return {
        error: "Something went wrong",
        success: false,
      }
    },
  },
}
