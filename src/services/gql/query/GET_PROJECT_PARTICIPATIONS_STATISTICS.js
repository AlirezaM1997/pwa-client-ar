import { gql } from "@apollo/client";

export const GET_PROJECT_PARTICIPATIONS_STATISTICS = gql`
  query Get_project_participations_statistics($projectId: ID!) {
    get_project_participations_statistics(projectId: $projectId) {
      capacity
      financial
      ideas
      moral
      presence
      skill
      total
    }
  }
`;
