import Portfolio from "../models/portfolioModel.js"
import Tag from "../models/tagModel.js"

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

      console.log(order, direction)

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

      console.log(order, direction)

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
  },

  Mutation: {
    async createTag(parent, args, context, info) {
      const { name } = args
      const tag = await Tag.create({ name })
      return tag.id
    },
  },
}
