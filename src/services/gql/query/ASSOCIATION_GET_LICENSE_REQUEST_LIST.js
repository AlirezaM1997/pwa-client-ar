import { gql } from "@apollo/client";

export const ASSOCIATION_GET_LICENSE_REQUEST_LIST = gql`
  query Association_get_license_requests_list($page: Int, $limit: Int) {
    association_get_license_requests_list(page: $page, limit: $limit) {
      total
      result {
        _id
        setadId
        setadImage
        setadName
        status
        createdAt
      }
    }
  }
`;
