import { gql } from "@apollo/client";

export const ASSOCIATION_GET_MY_PROJECTS = gql`
  query ($search: String, $page: Int, $limit: Int) {
    association_get_my_projects(search: $search, page: $page, limit: $limit) {
      result {
        _id
        title
        requirements {
          type
          title
        }
        imgs
        haveIBookmarked
        bookmarkable
        projectRequirementData {
          totalFinancialAmount
          participationsFinancialAmount
          donatePercentage
          participationsCount
        }
      }
      total
    }
  }
`;
