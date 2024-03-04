import { gql } from "@apollo/client";

export const USER_REJECT_PROJECT_PROPOSAL = gql`
  mutation User_reject_project_proposal($proposalId: ID!, $description: String!) {
    user_reject_project_proposal(proposalId: $proposalId, description: $description) {
      status
    }
  }
`;