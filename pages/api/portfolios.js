import mongoose from '../../middleware/mongoose.js';
import prepareQuery from '../../middleware/prepareQuery.js';
import Portfolio from '../../models/portfolioModel.js'
//import Tag from '../../models/tagModel.js'
import nextConnect from "next-connect";
import { calcPages } from "../../utils/utils.js"

const handler = nextConnect();

handler.use(mongoose())
handler.use(prepareQuery())

handler.get(async (req, res) => {
    
    const { perPage, sortObj, filterObj, skip, page } = req.mongoParams

    const total = await Portfolio.countDocuments(filterObj)
    const data = await Portfolio.find(filterObj)
        .limit(perPage)
        .skip(skip)
        .sort(sortObj)
        .populate("tags")

    res.json({
        page,
        perPage,
        total,
        pages: calcPages(perPage, total),
        data,
    })
})


export default handler