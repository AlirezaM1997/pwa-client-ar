import { gql } from "@apollo/client";

export const ASSOCIATION_MODIFY_PROJECT = gql`
  mutation ASSOCIATION_MODIFY_PROJECT(
    $projectId: ID!
    $modifyStatusData: AssociationModifyStatusDataInput!
  ) {
    association_modify_project(projectId: $projectId, modifyStatusData: $modifyStatusData) {
      status
    }
  }
`;
