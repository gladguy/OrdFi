import { WalletStandardProvider } from "@wallet-standard/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import LoadingWrapper from "../component/loading-wrapper";
import store, { persistor } from "../redux/store";
import "./../App.css";
import MainLayout from "./layout";

const App = () => {
  return (
    <React.Fragment>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <LoadingWrapper>
            <Router>
              <WalletStandardProvider>
                <MainLayout />
              </WalletStandardProvider>
            </Router>
          </LoadingWrapper>
        </PersistGate>
      </Provider>
    </React.Fragment>
  );
};

export default App;
