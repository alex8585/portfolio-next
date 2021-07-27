import Portfolio from "../models/portfolioModel.js"
import Tag from "../models/tagModel.js"
import User from "../models/userModel.js"
import { generateToken } from "../utils/utils.js"
import fs from "fs"

//import mongoose from "mongoose"
import {
  storeUpload,
  getTmpUploadsPath,
  getUploadsPath,
  getImgUrl,
  pathByUrl,
} from "../utils/storeUpload.js"

import { GraphQLUpload } from "graphql-upload"

//import { ApolloServer, gql, GraphQLUpload } from "apollo-server-micro"
function getFilterObj(filter) {
  let filterObj = {}

  if (filter && filter.tags) {
    let tagsFilter = filter.tags.split(",")
    filterObj["tags"] = { $in: tagsFilter }
  }
  return filterObj
}

export const resolvers = {
  FileUpload: GraphQLUpload,
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
      const { tags, uploadedFile } = args

      let tmpFile = getTmpUploadsPath(uploadedFile)
      let filePath = getUploadsPath() + "portfolios/" + uploadedFile
      let img = getImgUrl() + "portfolios/" + uploadedFile
      img = img.replace(/^\/+/g, "")

      fs.renameSync(tmpFile, filePath)

      let tagsIds = tags.map((e) => {
        return e.id
      })
      let insert = {
        ...args,
        tags: tagsIds,
        img,
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

      let portfolio = await Portfolio.findById(id)

      let imgPath = pathByUrl(portfolio.img)

      fs.unlink(imgPath, function (err) {
        if (err) return console.log(err)
      })

      let result = await portfolio.remove()
      //const result = await Portfolio.deleteOne({ _id: id })

      if (result && result._id) {
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

    uploadFile: async (parent, args, context, info) => {
      const { file } = await args
      let [path, url, name] = await storeUpload(file)

      return { path, url, name }
    },

    async editPortfolio(parent, args, context, info) {
      const { id, tags, uploadedFile } = args

      console.log(args)

      let tagsIds = tags.map((e) => {
        return e.id
      })

      let update = {
        ...args,
        tags: tagsIds,
      }

      const result = await Portfolio.updateOne({ _id: id }, update)
      console.log(result)
      if (result && result.ok > 0) {
        return {
          error: null,
          success: true,
        }
      }

      return {
        error: "Something went wrong",
        success: false,
      }

      // let tmpFile = getTmpUploadsPath(uploadedFile)
      // let filePath = getUploadsPath() + "portfolios/" + uploadedFile
      // let img = getImgUrl() + "portfolios/" + uploadedFile
      // img = img.replace(/^\/+/g, "")

      // fs.renameSync(tmpFile, filePath)
    },
  },
}
