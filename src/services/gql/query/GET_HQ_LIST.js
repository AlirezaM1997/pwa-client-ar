import { gql } from "@apollo/client"

export const GET_HQ_LIST = gql`
  query getHqList($page: Int, $limit: Int) {
    get_hq_list(page: $page, limit: $limit) {
      total
      result {
        _id
        image
        name
      }
    }
  }
`
