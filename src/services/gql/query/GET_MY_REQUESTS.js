import { gql } from "@apollo/client";

export const GET_MY_REQUESTS = gql`
  query Result($state: StateOptions!, $page: Int, $limit: Int) {
    get_my_projects(state: $state, page: $page, limit: $limit) {
      result {
        _id
        title
        requirements {
          type
          title
        }
        requirementsType
        projectRequirementData {
          totalFinancialAmount
          participationsFinancialAmount
          participationsCount
          donatePercentage
        }
        image
        imgs
        haveIBookmarked
        bookmarkable
      }
      total
    }
  }
`;

