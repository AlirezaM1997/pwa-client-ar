
import { gql } from "@apollo/client";

export const ASSOCIATION_ME = gql`
  query Association_me {
    association_me {
      _id
      name
      role
      lang
      image
      isBanned
    }
  }
`;
