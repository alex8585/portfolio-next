import { Provider } from 'react-redux'
import { useStore } from '../store'
import Head from 'next/head';

import {wrapper} from '../store';

const App = function ({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)

  return (
    <>
    
    <Head>
      <link rel="favicon icon" href="favicon.ico" />
    </Head>
      <Component {...pageProps} />
      </>
 
  )
}
export default wrapper.withRedux(App);