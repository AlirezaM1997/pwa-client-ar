import { gql } from "@apollo/client";

export const GET_PROJECTS_MAP = gql`
  query Get_projects($page: Int, $limit: Int, $filters: ProjectFilterInput) {
    get_projects(page: $page, limit: $limit, filters: $filters) {
      result {
        _id
        title
        location {
          geo {
            lat
            lon
          }
        }
        projectStatus {
          status
        }
      }
    }
  }
`;
