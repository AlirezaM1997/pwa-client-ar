import { gql } from "@apollo/client";

export const GET_MY_CHAT = gql`
  query Messages {
    get_my_chat {
      _id
      unseenCount
      messages {
        _id
      }
      lastText {
        _id
      }
      theOtherUser {
        _id
        image
      }
      unseenCount
      users {
        _id
      }
    }
  }
`;

