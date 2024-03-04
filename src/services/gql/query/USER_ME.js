import { gql } from "@apollo/client";

export const USER_ME = gql`
  query User_me {
    user_me {
      _id
      name
      role
      lang
      image
      isBanned
    }
  }
`;

