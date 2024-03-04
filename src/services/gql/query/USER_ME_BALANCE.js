import { gql } from "@apollo/client";

export const USER_ME_BALANCE = gql`
  query User_me {
    user_me {
      _id
      name
      image
      balance
    }
  }
`;

