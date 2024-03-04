import { gql } from "@apollo/client";

export const LANDING_SEND_LINKS = gql`
  mutation Landing_send_links($phoneNumber: PhoneNumber!) {
    landing_send_links(phoneNumber: $phoneNumber) {
      status
    }
  }
`;
