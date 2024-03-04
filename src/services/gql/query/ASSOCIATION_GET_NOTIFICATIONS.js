
import { gql } from "@apollo/client";

export const ASSOCIATION_GET_NOTIFICATIONS = gql`
query Association_get_notifications($page: Int, $limit: Int) {
  association_get_notifications(page: $page, limit: $limit) {
    total
    result {
      _id
      createdAt
      isSeen
      message
    }
  }
}
`;

