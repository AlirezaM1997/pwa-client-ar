import { gql } from "@apollo/client";

export const GET_BOOKMARKED_REQUESTS = gql`
  query Get_bookmarked_requests($page: Int, $limit: Int, $filters: ProjectRequestFilterInput) {
    get_bookmarked_requests(page: $page, limit: $limit, filters: $filters) {
      total
      result {
        _id
        title
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
