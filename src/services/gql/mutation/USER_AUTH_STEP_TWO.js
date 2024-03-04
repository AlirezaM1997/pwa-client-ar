import { gql } from "@apollo/client";

export const USER_AUTH_STEP_TWO = gql`
  mutation User_auth_stepTwo($code: String!, $phoneNumber: PhoneNumber!) {
    user_auth_stepTwo(code: $code, phoneNumber: $phoneNumber) {
      _id
      name
      refreshHash
      token
    }
  }
`;