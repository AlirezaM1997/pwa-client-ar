import { gql } from "@apollo/client";

export const SET_NAME = gql`
  mutation Set_name($name: String!, $prename: String) {
    set_name(name: $name, prename: $prename) {
      status
    }
  }
`;