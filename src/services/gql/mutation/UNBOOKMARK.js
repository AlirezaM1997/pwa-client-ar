import { gql } from "@apollo/client";

export const UNBOOKMARK = gql`
  mutation UnBookmark($id: ID!, $type: BookmarkTypeEnum!) {
    unBookmark(_id: $id, type: $type) {
      status
    }
  }
`;
