import { gql } from "@apollo/client";

export const ASSOCIATION_GET_PROJECT_PARTICIPATIONS = gql`
query association_get_project_participations($projectId: ID!, $participationFiltersData: ParticipationFiltersDataInput, $page: Int, $limit: Int) {
  association_get_project_participations(projectId: $projectId, participationFiltersData: $participationFiltersData, page: $page, limit: $limit) {
      total
      result {
        type
        title
        status
        participator {
          _id
          image
          name
          role
        }
        _id
        createdAt
        description
        amount
      }
    }
  }
`;
