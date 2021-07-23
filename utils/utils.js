import jwt from "jsonwebtoken"

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

export const calcPages = (pageSize, totalCount) => {
  return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize)
}

export const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user")
  if (!user) {
    return null
  }

  return JSON.parse(user)
}

export const getUserTokenFromLocalStorage = () => {
  let user = getUserFromLocalStorage()
  if (!user || !user.token) {
    return null
  }
  return user.token
}

export const deleteUserFromLocalStorage = () => {
  localStorage.removeItem("user")
}
