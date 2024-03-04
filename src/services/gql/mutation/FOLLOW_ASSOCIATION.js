import { gql } from "@apollo/client";

export const FOLLOW_ASSOCIATION = gql`
  mutation FOLLOW_ASSOCIATION($associationId: ID!) {
    follow_association(associationId: $associationId) {
      msg
      status
    }
  }
`;
