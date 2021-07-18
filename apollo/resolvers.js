import Portfolio from '../models/portfolioModel.js'
import Tag from '../models/tagModel.js'



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
    async getTags(parent, args, context, info)  {
      const data = await Tag.find()
      return data
    },

    async totalTags(parent, args, context, info)  {
        const total = await Tag.countDocuments()
        return total
    },

    async getPortfolios(parent, args, context, info)  {
      const { perPage, filter, page } = args
      const skip =  perPage * (page - 1);
      
      const filterObj = getFilterObj(filter)
      const data = await Portfolio.find(filterObj).populate("tags").limit(perPage)
      .skip(skip)
      .sort({ order_number: 1 })
      return data
    },

    async totalPortfolios(parent, args, context, info)  {
        const {  filter } = args
        const filterObj = getFilterObj(filter)

        const total = await Portfolio.countDocuments(filterObj)
        return total
    },

  }
};




