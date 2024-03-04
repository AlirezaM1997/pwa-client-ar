import { gql } from "@apollo/client";

export const GET_PROJECT_ACTIVISTS = gql`
  query Get_projects_activists($projectId: ID!, $page: Int, $sortBy: String, $mojriPage: Boolean, $limit: Int) {
    get_projects_activists(projectId: $projectId, page: $page, sortBy: $sortBy, mojriPage: $mojriPage, limit: $limit) {
      result {
        participationStatistics {
          capacity {
            approved
            rejected
            total
          }
          financial {
            approved
            rejected
            total
          }
          ideas {
            approved
            rejected
            total
          }
          moral {
            approved
            rejected
            total
          }
          presence {
            approved
            rejected
            total
          }
          skill {
            approved
            rejected
            total
          }
        }
        user {
          _id
          averageScore
          name
          scoreCount
          role
        }
        responsibilities {
          _id
          status
          text
          description
          category {
            title
          }
        }
        service {
          _id
          date
          status
        }
      }
    }
  }
`;

