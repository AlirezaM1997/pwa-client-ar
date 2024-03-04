import { useMemo } from "react";
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { store } from "@store/store";
import { getMainDefinition } from "@apollo/client/utilities";
import { ApolloLink } from "@apollo/client/core";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { createUploadLink } from "apollo-upload-client";
import { getCookie } from "cookies-next";

const httpLink = new HttpLink({ uri: `${process.env.NEXT_PUBLIC_API_URL}` });

const authMiddleware = new ApolloLink((operation, forward) => {
  const _token = store.getState().token.token;
  const lang = getCookie("NEXT_LOCALE") ? getCookie("NEXT_LOCALE") : "en";
  operation.setContext({
    headers: {
      Authorization: `ut ${_token}`,
      lang: "ar",
    },
  });
  return forward(operation);
});

function routeToPage500() {
  window.location.href = "/error/500";
}
function routeToPageNetwork() {
  window.location.href = "/error/network";
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, location }) => {});
    if (graphQLErrors[0].message === "Failed to fetch") {
      routeToPage500();
    }
  }
  if (networkError) {
    // routeToPageNetwork();
  }
});

const uploadLink = createUploadLink({ uri: `${process.env.NEXT_PUBLIC_API_URL}` });

const newHttpLink = ApolloLink.from([errorLink, authMiddleware, httpLink]);

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: `${process.env.NEXT_PUBLIC_WS_URL}`,
          connectionParams: function () {
            const token = store.getState().token.token;
            return {
              Authorization: `ut ${token}`,
            };
          },
        })
      )
    : null;
const splitLink =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" && definition.operation === "subscription"
          );
        },
        wsLink,
        newHttpLink,
        uploadLink
      )
    : newHttpLink;

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: splitLink,
    cache: new InMemoryCache(),
  });
}

let apolloClient;
export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();
  if (initialState) {
    const existingCache = _apolloClient.extract();
    // eslint-disable-next-line no-undef
    const data = merge(initialState, existingCache, {
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        // eslint-disable-next-line no-undef
        ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s))),
      ],
    });
    _apolloClient.cache.restore(data);
  }

  if (typeof window === "undefined") return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }
  return pageProps;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
