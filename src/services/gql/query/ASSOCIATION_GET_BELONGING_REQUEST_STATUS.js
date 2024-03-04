import { gql } from "@apollo/client";

export const ASSOCIATION_GET_BELONGING_request_status = gql`
  query Query($setadId: ID!) {
    association_get_belonging_request_status(setadId: $setadId)
  }
`;
