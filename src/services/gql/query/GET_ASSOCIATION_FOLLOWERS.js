import { gql } from "@apollo/client";

export const GET_ASSOCIATION_FOLLOWERS = gql`
  query Get_association_followers($id: ID!, $page: Int, $limit: Int) {
    get_association_followers(_id: $id, page: $page, limit: $limit) {
      users {
        _id
        role
        name
      }
    }
  }
`;

