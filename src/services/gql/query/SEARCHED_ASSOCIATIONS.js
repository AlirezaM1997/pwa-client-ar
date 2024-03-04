import { gql } from "@apollo/client";

export const SEARCHED_ASSOCIATIONS = gql`query Get_associations($page: Int, $limit: Int, $filters: AssociationFilterInput) {
  get_associations(page: $page, limit: $limit, filters: $filters) {
    result {
      _id
      name
      averageScore
      image
      verifyBadge
    }
    total
  }
}`

