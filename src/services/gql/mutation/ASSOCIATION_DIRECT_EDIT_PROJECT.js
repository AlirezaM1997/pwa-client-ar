import { gql } from "@apollo/client";

export const ASSOCIATION_DIRECT_EDIT_PROJECT = gql`
  mutation Association_direct_edit_project(
    $projectId: ID!
    $associationSpeceficData: ProjectCreationAssocciationInput!
    $serviceSetting: servicesSettingInput
    $data: ProjectRequestInput!
  ) {
    association_direct_edit_project(
      projectId: $projectId
      associationSpeceficData: $associationSpeceficData
      serviceSetting: $serviceSetting
      data: $data
    ) {
      msg
      status
    }
  }
`;
