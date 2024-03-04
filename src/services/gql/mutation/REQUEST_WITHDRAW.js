import { gql } from "@apollo/client";

export const REQUEST_WITHDRAW = gql`
  mutation Request_withdraw($amount: Float!, $walletId: ID!, $description: String) {
    request_withdraw(amount: $amount, walletId: $walletId, description: $description) {
      status
    }
  }
`;
