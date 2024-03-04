import { gql } from "@apollo/client";

export const USER_DELETE_PROJECT_REQUEST = gql`
  mutation User_delete_project_request($projectRequestId: ID!) {
    user_delete_project_request(projectRequestId: $projectRequestId) {
      status
    }
  }
`;
