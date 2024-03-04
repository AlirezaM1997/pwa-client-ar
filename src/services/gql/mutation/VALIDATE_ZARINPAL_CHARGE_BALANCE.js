import { gql } from "@apollo/client";

export const VALIDATE_ZARINPAL_CHARGE_BALANCE = gql`
  mutation Validate_zarinpal_charge_balance($status: String, $authority: String) {
    validate_zarinpal_charge_balance(Status: $status, Authority: $authority) {
      msg
      status
    }
  }
`;
