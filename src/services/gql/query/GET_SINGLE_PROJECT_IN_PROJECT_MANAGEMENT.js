import { gql } from "@apollo/client";

export const GET_SINGLE_PROJECT_IN_PROJECT_MANAGEMENT = gql`
  query GetSingleProject($id: ID!) {
    getSingleProject(_id: $id) {
      _id
      title
      imgs
      projectStatus {
        status
      }
    }
  }
`;
