import { gql } from "@apollo/client";

export const REFRESH_TOKEN = gql`
  mutation Refresh_token($refreshHash: String!) {
    refresh_token(refreshHash: $refreshHash) {
      _id
      refreshHash
      token
      name
    }
  }
`;
