import { gql } from "@apollo/client";

export const ASSOCIATION_CREATE_PROJECT = gql`
  mutation Association_createProject(
    $data: ProjectRequestInput
    $associationSpeceficData: ProjectCreationAssocciationInput
    $mpid: ID
    $serviceSetting: servicesSettingInput
  ) {
    association_createProject(
      data: $data
      associationSpeceficData: $associationSpeceficData
      MPID: $mpid
      serviceSetting: $serviceSetting
    ) {
      _id
    }
  }
`;
