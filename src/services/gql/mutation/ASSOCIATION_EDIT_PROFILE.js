import { gql } from "@apollo/client";

export const ASSOCIATION_EDIT_PROFILE = gql`
  mutation Association_edit_profile($data: associationEditProfile) {
    association_edit_profile(data: $data) {
      status
    }
  }
`;
