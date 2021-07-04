import axios from "axios"

function getUrl() {
  //console.log(process.env.NEXT_PUBLIC_ENV);

  let url = process.env.NEXT_PUBLIC_LOCAL_API_URL
  if (process.env.NEXT_PUBLIC_ENV !== "development") {
    url = process.env.NEXT_PUBLIC_API_URL
  }
  console.log(url)
  return url
}

export const getList = async (
  resource,
  { perPage = "6", page = "1", filter = "" },
  config = {}
) => {
  const url = getUrl()
  return await axios.get(
    `${url}/${resource}?perPage=${perPage}&page=${page}&filter=${filter}`,
    config
  )
}
