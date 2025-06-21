import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Create the HTTP link for Arweave's GraphQL endpoint
const httpLink = createHttpLink({
  uri: 'https://arweave.net/graphql',
});

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
}); 