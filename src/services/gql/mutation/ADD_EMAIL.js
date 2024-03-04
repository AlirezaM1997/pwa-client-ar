import { gql } from "@apollo/client";

export const ADD_EMAIL = gql`
  mutation Add_email_data($email: Email!) {
    add_email_data(email: $email) {
      status
    }
  }
`;
