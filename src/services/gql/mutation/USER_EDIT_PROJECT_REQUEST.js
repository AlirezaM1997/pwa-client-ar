import { gql } from "@apollo/client";

export const USER_EDIT_PROJECT_REQUEST = gql`
  mutation User_edit_projectRequest($requestId: ID!, $data: ProjectRequestInput!) {
    user_edit_projectRequest(requestId: $requestId, data: $data) {
      status
    }
  }
`;