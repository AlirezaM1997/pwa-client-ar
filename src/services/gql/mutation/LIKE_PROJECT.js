
import { gql } from "@apollo/client";

export const LIKE_PROJECT = gql`
  mutation Like_project($projectId: ID!) {
    like_project(projectId: $projectId) {
      msg
      status
    }
  }
`;