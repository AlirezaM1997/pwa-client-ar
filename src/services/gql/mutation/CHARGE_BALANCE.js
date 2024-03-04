
import { gql } from "@apollo/client";

export const CHARGE_BALANCE = gql`
  mutation ($amount: Float, $redirectTo: String, $src: String) {
    charge_balance(amount: $amount, redirectTo: $redirectTo, src: $src)
  }
`;