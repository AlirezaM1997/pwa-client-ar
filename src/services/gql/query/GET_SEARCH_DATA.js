import { gql } from "@apollo/client";

export const GET_SEARCH_DATA = gql`query Get_search_data($search: String, $limit: Int, $page: Int) {
  get_search_data(search: $search, limit: $limit, page: $page) {
    associations {
      result {
        name
        _id
        image
        verifyBadge
      }
    }
    projectRequests {
      result {
        title
        _id
        imgs
      }
    }
    projects {
      result {
        title
        _id
        imgs
        isAssignedTo
      }
    }
  }
}`

