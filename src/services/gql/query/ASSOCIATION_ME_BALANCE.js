
import { gql } from "@apollo/client";

export const ASSOCIATION_ME_BALANCE = gql`
  query Association_me {
    association_me {
      _id
      name
      image
      balance
    }
  }
`;
