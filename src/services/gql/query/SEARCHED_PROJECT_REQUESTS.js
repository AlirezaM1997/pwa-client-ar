import { gql } from "@apollo/client";

export const SEARCHED_PROJECT_REQUESTS = gql`
  query Get_project_requests($page: Int, $limit: Int, $filters: ProjectRequestFilterInput) {
    get_project_requests(page: $page, limit: $limit, filters: $filters) {
      total
      result {
        _id
        title
        imgs
        requirements {
          type
        }
      }
    }
  }
`;
