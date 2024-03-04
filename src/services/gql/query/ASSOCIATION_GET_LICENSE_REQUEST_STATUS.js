import { gql } from "@apollo/client";

export const ASSOCIATION_GET_LICENSE_REQUEST_STATUS = gql`
  query Query($setadId: ID!) {
    association_get_license_request_status(setadId: $setadId)
  }
`;
