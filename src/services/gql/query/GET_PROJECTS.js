import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query Get_projects($page: Int, $limit: Int, $filters: ProjectFilterInput) {
    get_projects(page: $page, limit: $limit, filters: $filters) {
      result {
        _id
        title
        scoreCount
        imgs
        averageScore
        requirements {
          _id
          type
        }
        projectRequirementData {
          totalFinancialAmount
          participationsFinancialAmount
          participationsCount
          donatePercentage
        }
        location {
          geo {
            lat
            lon
          }
        }
        participationCount
        projectStatus {
          status
        }
        haveILiked
        haveIBookmarked
        bookmarkable
      }
      total
    }
  }
`;
