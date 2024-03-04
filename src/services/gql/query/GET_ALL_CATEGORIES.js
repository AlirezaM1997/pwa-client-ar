import { gql } from "@apollo/client";

export const GET_ALL_CATEGORIES = gql`
  query Get_all_categories {
    get_all_categories {
      _id
      title
      type
      usability
      parent {
        _id
      }
    }
  }
`;

