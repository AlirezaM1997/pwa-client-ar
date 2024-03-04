import { gql } from "@apollo/client";

export const VALIDATE_ZARINPAL_LOGGED_IN_PAYMENT = gql`
  mutation Validate_zarinpal_logged_in_payment($authority: String, $status: String) {
    validate_zarinpal_logged_in_payment(Authority: $authority, Status: $status) {
      msg
      status
    }
  }
`;
