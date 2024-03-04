
import { gql } from "@apollo/client";

export const GET_ME_CHAT = gql`
  query Get_my_chat {
    get_my_chat {
      _id
      unseenCount
      lastText {
        _id
        createdAt
      }
      messages {
        _id
        text
        from {
          _id
          name
        }
        to {
          _id
          name
        }
        isMe
        createdAt
      }
      theOtherUser {
        _id
        name
        image
      }
    }
  }
`;

