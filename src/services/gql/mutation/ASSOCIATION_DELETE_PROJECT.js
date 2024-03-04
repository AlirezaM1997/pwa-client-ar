import { gql } from "@apollo/client";

export const ASSOCIATION_DELETE_PROJECT = gql`
  mutation Association_delete_project($projectId: ID!) {
    association_delete_project(projectId: $projectId) {
      status
    }
  }
`;
