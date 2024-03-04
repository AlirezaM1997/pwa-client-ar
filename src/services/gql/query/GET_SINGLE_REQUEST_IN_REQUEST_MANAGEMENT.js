import { gql } from "@apollo/client";

export const GET_SINGLE_REQUEST_IN_REQUEST_MANAGEMENT = gql`
  query GetSingleProjectRequest($id: ID!) {
    getSingleProjectRequest(_id: $id) {
      _id
      title
      imgs
      status
    }
  }
`;
