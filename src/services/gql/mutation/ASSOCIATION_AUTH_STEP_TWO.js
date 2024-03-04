import { gql } from "@apollo/client";

export const ASSOCIATION_AUTH_STEP_TWO = gql`
  mutation Association_auth_stepTwo($phoneNumber: PhoneNumber!, $code: String!) {
    association_auth_stepTwo(phoneNumber: $phoneNumber, code: $code) {
      _id
      name
      token
      refreshHash
    }
  }
`;
