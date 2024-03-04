import { gql } from "@apollo/client";

export const USER_GET_MY_PROJECT_REQUESTS = gql`
  query User_get_my_project_requests($page: Int, $limit: Int, $search: String) {
    user_get_my_project_requests(page: $page, limit: $limit, search: $search) {
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
        requirementsType
      }
      total
    }
  }
`;
