import { gql } from "@apollo/client";

export const MAKE_SEEN = gql`
  mutation MakeSeen($chatRoomId: ID!) {
    makeSeen(chatRoomId: $chatRoomId) {
      status
      msg
    }
  }
`;
