import { gql } from "@apollo/client";

export const ASSOCIATION_APPROVE_PARTICIPATION = gql`
  mutation Association_approve_participation($participationId: ID!) {
    association_approve_participation(participationId: $participationId) {
      status
    }
  }
`;
