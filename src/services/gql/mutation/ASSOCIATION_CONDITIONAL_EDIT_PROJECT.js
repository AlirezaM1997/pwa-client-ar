import { gql } from "@apollo/client";

export const ASSOCIATION_CONDITIONAL_EDIT_PROJECT = gql`
  mutation Association_conditional_edit_project(
    $projectId: ID!
    $data: ProjectRequestInput!
    $associationSpeceficData: ProjectCreationAssocciationInput!
    $serviceSetting: servicesSettingInput
  ) {
    association_conditional_edit_project(
      projectId: $projectId
      data: $data
      associationSpeceficData: $associationSpeceficData
      serviceSetting: $serviceSetting
    ) {
      msg
      status
    }
  }
`;
