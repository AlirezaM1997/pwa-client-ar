import { gql } from "@apollo/client";

export const GET_ROOT_SUBJECTS = gql`
  query ExampleQuery {
    get_root_subjects {
      _id
      icon
      name
      image
      children {
        name
        _id
      }
    }
  }
`;

