import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import Layout from "../components/layout";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { useRouter } from "next/router";
import { MetaMaskProvider } from "metamask-react";
import Meta from "../components/Meta";
import UserContext from "../components/UserContext";
import { WalletProvider } from "../context/walletContext";
import { PersistGate } from 'redux-persist/integration/react';
import { useRef } from "react";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pid = router.asPath;
  const scrollRef = useRef({
    scrollPos: 0,
  });

  return (
    <>
      <Meta title="Home 1" />

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider enableSystem={true} attribute="class">
            <MetaMaskProvider>
              <WalletProvider>
                <UserContext.Provider value={{ scrollRef: scrollRef }}>
                  {pid === "/login" ? (
                    <Component {...pageProps} />
                  ) : (
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  )}
                </UserContext.Provider>
              </WalletProvider>
            </MetaMaskProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
