import { gql } from "@apollo/client";

export const ASSOCIATION_DISAPPROVE_PARTICIPATION = gql`
  mutation Association_disapprove_participation($participationId: ID!) {
    association_disapprove_participation(participationId: $participationId) {
      status
    }
  }
`;
