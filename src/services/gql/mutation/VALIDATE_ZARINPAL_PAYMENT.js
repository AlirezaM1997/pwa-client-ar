import { gql } from "@apollo/client";

export const VALIDATE_ZARINPAL_PAYMENT = gql`
  mutation Validate_zarinpal_payment($status: String, $authority: String) {
    validate_zarinpal_payment(Status: $status, Authority: $authority) {
      msg
      status
    }
  }
`;
