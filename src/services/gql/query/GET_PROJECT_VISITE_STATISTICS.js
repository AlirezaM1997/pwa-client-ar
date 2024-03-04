import { gql } from "@apollo/client";

export const GET_PROJECT_VISIT_STATISTICS = gql`
query Get_project_visit_statistics($projectId: ID!) {
    get_project_visit_statistics(projectId: $projectId) {
      result {
        date
        visitPerDay
      }
      total
    }
}`