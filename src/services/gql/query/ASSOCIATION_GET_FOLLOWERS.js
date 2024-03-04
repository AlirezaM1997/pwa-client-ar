import { gql } from "@apollo/client";

export const ASSOCIATION_GET_FOLLOWERS = gql`
  query Association_get_followers($page: Int, $limit: Int) {
    association_get_followers(page: $page, limit: $limit) {
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
