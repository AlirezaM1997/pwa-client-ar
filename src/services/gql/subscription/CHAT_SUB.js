import { gql } from "@apollo/client";

export const CHAT_SUB = gql`
  subscription Subscription {
    connect_real_time {
      item {
        _id
        from {
          name
          _id
        }
        to {
          _id
          name
        }
        text
        date
        isSeen
        isMe
        createdAt
      }
      theOtherUser {
        _id
        name
      }
      notifType
    }
  }
`;