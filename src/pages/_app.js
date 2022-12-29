
import Router from "next/router";

import 'antd/dist/antd.css';
import MainLayout from '@themes';
import "@styles/nprogress.min.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-input-2/lib/style.css';

// progress bars
import NProgress from 'nprogress';
NProgress.configure({ showSpinner: true });
Router.onRouteChangeStart    = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError    = () => NProgress.done();


//redux bindings
import { Store, InitialState } from '@services';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

let { store, persistor } = Store ( InitialState )

const App = ({ Component, pageProps }) => {
  return (
    <Provider store = { store } >
      <PersistGate loading={null} persistor={persistor}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </PersistGate>	
    </Provider>
  )
}

export default App