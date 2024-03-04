import { gql } from "@apollo/client";

export const GET_MY_PROJECTS = gql`
  query Result($state: StateOptions!, $page: Int, $limit: Int, $search: String) {
    get_my_projects(state: $state, page: $page, limit: $limit, search: $search) {
      result {
        _id
        title
        requirements {
          type
          title
        }
        projectRequirementData {
          totalFinancialAmount
          participationsFinancialAmount
          participationsCount
          donatePercentage
        }
        imgs
        image
        haveIBookmarked
        bookmarkable
      }
      total
    }
  }
`;
