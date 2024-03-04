import { gql } from "@apollo/client";

export const ASSOCIATION_GET_BELONGING_REQUEST_LIST = gql`
  query Association_get_belonging_requests_list($page: Int, $limit: Int) {
    association_get_belonging_requests_list(page: $page, limit: $limit) {
      result {
        _id
        setadId
        hqId
        status
        associationId
        associationName
        associationImage
        createdAt
        setadImage
        setadName
      }
      total
    }
  }
`;
