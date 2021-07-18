
import { ApolloServer} from 'apollo-server-micro'
import { schema } from '../../apollo/schema'
import dbConnect from '../../utils/dbConnect';

await dbConnect();

export const config = {
  api: {
    bodyParser: false,
  },
}


const apolloServer = new ApolloServer({schema});
export default apolloServer.createHandler({ path: '/api/graphql' })
//module.exports = await true;