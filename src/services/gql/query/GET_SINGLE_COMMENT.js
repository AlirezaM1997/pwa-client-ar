import { gql } from "@apollo/client";

export const GET_SINGLE_COMMENT = gql`
  query Get_single_comment($commentId: ID!) {
    get_single_comment(commentId: $commentId) {
      _id
      text
      replyCount
      likeCount
      dislikeCount
      haveILiked
      haveIdisliked
      updatedAt
      createdAt
      hasParent
      creator {
        _id
        name
      }
    }
  }
`;

