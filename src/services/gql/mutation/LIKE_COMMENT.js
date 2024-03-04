import { gql } from "@apollo/client";

export const LIKE_COMMENT = gql`
  mutation Like_comment($commentId: ID!, $state: LikeCommentStateEnum!) {
    like_comment(commentId: $commentId, state: $state) {
      msg
      status
    }
  }
`;