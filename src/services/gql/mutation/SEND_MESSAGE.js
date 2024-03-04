import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation Mutation($data: ChatMessageInput) {
    sendMessage(data: $data) {
      msg
      status
    }
  }
`;