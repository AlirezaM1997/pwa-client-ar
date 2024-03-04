import { gql } from "@apollo/client";

export const ASSOCIATION_SUBMIT_LICENSE_REQUEST = gql`
  mutation Association_submit_license_request($setadId: ID!, $description: String) {
    association_submit_license_request(setadId: $setadId, description: $description) {
      status
    }
  }
`;
