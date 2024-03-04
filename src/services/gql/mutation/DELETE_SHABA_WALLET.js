import { gql } from "@apollo/client";

export const DELETE_SHABA_WALLET = gql`
  mutation Delete_shaba_wallet($id: ID!) {
    delete_shaba_wallet(_id: $id) {
      status
    }
  }
`;