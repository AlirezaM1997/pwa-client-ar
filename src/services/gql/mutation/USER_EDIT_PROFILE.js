import { gql } from "@apollo/client";

export const USER_EDIT_PROFILE = gql`
  mutation User_edit_profile($data: userDataInput!) {
    user_edit_profile(data: $data) {
      status
    }
  }
`;
