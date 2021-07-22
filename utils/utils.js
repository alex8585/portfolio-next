import jwt from "jsonwebtoken"

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

export const calcPages = (pageSize, totalCount) => {
  return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize)
}
