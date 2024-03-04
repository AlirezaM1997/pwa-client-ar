import { gql } from "@apollo/client";

export const USER_VISIT_BY_LINK = gql`
  mutation User_visits_by_link($link: String) {
    user_visits_by_link(link: $link) {
      status
    }
  }
`;
