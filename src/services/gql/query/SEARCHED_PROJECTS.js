import { gql } from "@apollo/client";

export const SEARCHED_PROJECTS = gql`query Get_projects($page: Int, $limit: Int, $filters: ProjectFilterInput) {
  get_projects(page: $page, limit: $limit, filters: $filters) {
    total
    result {
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
      haveIBookmarked
      bookmarkable
      _id
      title
      imgs
    }
  }
}`

