import { gql } from "@apollo/client";

export const ADD_SHABA_WALLET = gql`
  mutation Add_shaba_wallet($cartNumber: String!, $shabaNumber: String, $bankName: String) {
    add_shaba_wallet(cartNumber: $cartNumber, shabaNumber: $shabaNumber, bankName: $bankName) {
      status
      msg
    }
  }
`;
