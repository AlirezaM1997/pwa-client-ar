import { gql } from "@apollo/client";

export const GET_PROJECT_REQUESTS = gql`
  query Get_project_requests($page: Int, $limit: Int, $filters: ProjectRequestFilterInput) {
    get_project_requests(page: $page, limit: $limit, filters: $filters) {
      result {
        _id
        title
        imgs
        requirements {
          _id
          type
        }
      }
      total
    }
  }
`;

