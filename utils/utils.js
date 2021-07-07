export const calcPages = (pageSize, totalCount) => {
  return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize)
}