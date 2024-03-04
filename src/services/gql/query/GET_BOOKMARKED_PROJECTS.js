import { gql } from "@apollo/client";

export const GET_BOOKMARKED_PROJECTS = gql`
  query Get_bookmarked_projects($page: Int, $limit: Int, $filters: ProjectFilterInput) {
    get_bookmarked_projects(page: $page, limit: $limit, filters: $filters) {
      total
      result {
        _id
        title
        projectRequirementData {
          totalFinancialAmount
          participationsFinancialAmount
          participationsCount
          donatePercentage
        }
        requirements {
          type
          _id
          title
        }
        imgs
        bookmarkable
        haveIBookmarked
      }
    }
  }
`;
