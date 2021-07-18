import {wrapper} from '../store';
import '../styles/global.css'

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";


const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache()
});

const App = function ({ Component, pageProps }) {
  return (
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
  )
}

export default wrapper.withRedux(App);