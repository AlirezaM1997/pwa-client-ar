import { gql } from "@apollo/client";

export const ASSOCIATION_AUTH_STEP_ONE_PROD = gql`
  mutation Association_auth_stepOne($phoneNumber: PhoneNumber!) {
    association_auth_stepOne(phoneNumber: $phoneNumber) {
      status
    }
  }
`;
