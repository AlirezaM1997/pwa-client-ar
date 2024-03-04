import { gql } from "@apollo/client";

export const BOOKMARK = gql`
  mutation Bookmark($id: ID!, $type: BookmarkTypeEnum!) {
    bookmark(_id: $id, type: $type) {
      status
    }
  }
`;
