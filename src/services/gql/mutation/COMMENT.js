import { gql } from "@apollo/client";

export const COMMENT = gql`
  mutation ($data: CommentInfo!) {
    comment(data: $data) {
      data {
        _id
        createdAt
        creator {
          _id
          name
        }
        dislikeCount
        hasParent
        haveILiked
        haveIdisliked
        likeCount
        replyCount
        text
      }
      result {
        status
        msg
      }
    }
  }
`;