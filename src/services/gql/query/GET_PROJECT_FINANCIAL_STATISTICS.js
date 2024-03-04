import { gql } from "@apollo/client";

export const GET_PROJECT_FINANCIAL_STATISTICS = gql`
  query Get_project_financial_statistics($projectId: ID!) {
    get_project_financial_statistics(projectId: $projectId) {
      result {
        amountPerDay
        count
        date
      }
      total
    }
  }
`;
