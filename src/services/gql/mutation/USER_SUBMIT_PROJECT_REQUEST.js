import { gql } from "@apollo/client";

export const USER_SUBMIT_PROJECT_REQUEST = gql`
  mutation Mutation($data: ProjectRequestInput!) {
    user_submitProjectRequest(data: $data) {
      _id
    }
  }
`;