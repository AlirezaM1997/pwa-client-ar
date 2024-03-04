import { gql } from "@apollo/client";

export const GET_CAMPAIGN_PROJECTS_LIST = gql`query Get_campain_projects_list($campainLink: String!, $page: Int, $limit: Int, $filters: ProjectFilterInput) {
    get_campain_projects_list(campainLink: $campainLink, page: $page, limit: $limit, filters: $filters) {
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