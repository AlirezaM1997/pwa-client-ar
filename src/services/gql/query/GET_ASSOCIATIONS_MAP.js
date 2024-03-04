import { gql } from "@apollo/client";

export const GET_ASSOCIATIONS_MAP = gql`
  query Get_associations($page: Int, $filters: AssociationFilterInput, $limit: Int) {
    get_associations(page: $page, filters: $filters, limit: $limit) {
      result {
        _id
        name
        location {
          geo {
            lat
            lon
          }
        }
      }
    }
  }
`;
