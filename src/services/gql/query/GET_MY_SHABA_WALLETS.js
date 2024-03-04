import { gql } from "@apollo/client";

export const GET_MY_SHABA_WALLETS = gql`
  query Get_my_shaba_wallets {
    get_my_shaba_wallets {
      _id
      bankName
      shabaNumber
      text
      cartNumber
    }
  }
`;
