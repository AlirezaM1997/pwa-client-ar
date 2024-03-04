import { gql } from "@apollo/client";

export const PARTICIPATE_IN_PROJECT = gql`
mutation Participate_in_project($projectId: ID!, $data: ProjectParticipationInput!) {
  participate_in_project(projectId: $projectId, data: $data) {
    status
  }
}
`;