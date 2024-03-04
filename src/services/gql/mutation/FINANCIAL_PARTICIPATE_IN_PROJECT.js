import { gql } from "@apollo/client";

export const FINANCIAL_PARTICIPATE_IN_PROJECT = gql`
  mutation Unsafe_financial_participation_in_project($projectId: ID!, $amount: Float!) {
    unsafe_financial_participation_in_project(projectId: $projectId, amount: $amount) {
      status
    }
  }
`;
