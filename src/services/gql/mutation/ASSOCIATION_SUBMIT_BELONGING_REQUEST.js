import { gql } from "@apollo/client";

export const ASSOCIATION_SUBMIT_BELONGING_REQUEST = gql`
  mutation Association_submit_belonging_request($setadId: ID!) {
    association_submit_belonging_request(setadId: $setadId) {
      msg
      status
    }
  }
`;
