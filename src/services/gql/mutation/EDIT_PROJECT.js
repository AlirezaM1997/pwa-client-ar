import { gql } from "@apollo/client";

export const EDIT_PROJECT = gql`
  mutation (
    $projectId: ID!
    $data: ProjectRequestInput!
    $associationSpeceficData: ProjectCreationAssocciationInput!
    $serviceSetting: servicesSettingInput
  ) {
    association_edit_assignedProject(
      projectId: $projectId
      data: $data
      associationSpeceficData: $associationSpeceficData
      serviceSetting: $serviceSetting
    ) {
      status
    }
  }
`;
