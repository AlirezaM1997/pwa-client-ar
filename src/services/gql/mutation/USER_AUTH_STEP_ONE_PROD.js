import { gql } from "@apollo/client";

export const USER_AUTH_STEP_ONE_PROD = gql`
  mutation User_auth_stepOne($phoneNumber: PhoneNumber!) {
    user_auth_stepOne(phoneNumber: $phoneNumber) {
      status
    }
  }
`;
