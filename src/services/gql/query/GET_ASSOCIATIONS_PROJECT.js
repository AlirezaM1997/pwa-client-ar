import { gql } from "@apollo/client";

export const GET_ASSOCIATIONS_PROJECT = gql`
  query Get_associations_project($id: ID) {
    get_associations_project(_id: $id) {
      _id
      title
      status
      imgs
      requirements {
        _id
        type
        amount
      }
      projectRequirementData {
        totalFinancialAmount
        participationsFinancialAmount
        participationsCount
        donatePercentage
      }
      haveIBookmarked
      bookmarkable
    }
  }
`;
