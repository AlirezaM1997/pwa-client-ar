import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
  query Get_comments($targetType: CommentTargetTypeEnum!, $targetId: ID!, $page: Int, $limit: Int) {
    get_comments(targetType: $targetType, targetId: $targetId, page: $page, limit: $limit) {
      total
      result {
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
    }
  }
`;

