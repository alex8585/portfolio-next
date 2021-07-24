import { gql } from "@apollo/client"
import { initializeApollo } from "../apollo/client"

const client = initializeApollo()

const UPLOAD_FILE_QUERY = gql`
  mutation UploadFile($a: String, $file: Upload!) {
    uploadFile(file: $file, a: $a) {
      filename
    }
  }
`

export const uploadFileRequest = async (file) => {
  console.log(file.name)

  let res = await client.query({
    query: UPLOAD_FILE_QUERY,
    variables: { a: "sss", file },
    fetchPolicy: "no-cache",
  })

  return res
}
