import "../styles/globals.css";
import { useEffect } from "react";
import { store } from "@store/store";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { ApolloProvider } from "@apollo/client";
import { appWithTranslation } from "next-i18next";
import { useApollo } from "@services/apollo-client";
import { ThemeProvider } from "@material-tailwind/react";
import { PersistGate } from "redux-persist/integration/react";
// import { firebaseApp, analytics } from "@services/firebaseInit";
import { analytics } from "@services/firebaseInit";
import { hidden_desktop_header_routes, hidden_footer_menu_routes } from "@constants/index";
//HOOK
// import useFcmToken from "@hooks/useFcmToken";
//COMPONENT
import Layout from "@components/common/layout/Main";

const MyApp = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps.initialApolloState);
  let persistor = persistStore(store);

  // Use the token as needed
  // const { fcmToken, notificationPermissionStatus } = useFcmToken();

  useEffect(() => {
    //ANALYTICS
    // analytics;

    //FCM
    // if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    //   const messaging = getMessaging(firebaseApp);
    //   const unsubscribe = onMessage(messaging, (payload) => {
    //     console.log("Foreground push notification received:", payload);
    //     // Handle the received push notification while the app is in the foreground
    //   });
    //   return () => {
    //     unsubscribe(); // Unsubscribe from the onMessage event
    //   };
    // }
  }, []);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={apolloClient}>
            <ThemeProvider>
              <Layout
                hiddenFooterMenuRoutes={hidden_footer_menu_routes}
                hiddenDesktopHeaderRoutes={hidden_desktop_header_routes}
              >
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </ApolloProvider>
        </PersistGate>
      </Provider>
    </>
  );
};

export default appWithTranslation(MyApp);
