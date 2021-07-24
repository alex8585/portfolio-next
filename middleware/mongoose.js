import dbConnect from "../utils/dbConnect"
import { json } from "micro"
import { processRequest } from "graphql-upload"

function mongoose() {
  return async (req, res, next) => {
    await dbConnect()

    console.log("1")
    const contentType = req.headers["content-type"]
    if (contentType && contentType.startsWith("multipart/form-data")) {
      //req.filePayload = await processRequest(req, res)
    }
    console.log("2")
    console.log(req.files)
    next()
  }
}

export default mongoose
