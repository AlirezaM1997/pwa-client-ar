import { gql } from "@apollo/client";

export const GET_FOLLOWINGS = gql`
  query Get_followings($page: Int, $limit: Int) {
    get_followings(page: $page, limit: $limit) {
      total
      users {
        haveIfollowed
        image
        _id
        averageScore
        name
        role
      }
    }
  }
`;
