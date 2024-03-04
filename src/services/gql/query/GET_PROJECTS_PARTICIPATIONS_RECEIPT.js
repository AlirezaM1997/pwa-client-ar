import { gql } from "@apollo/client";

export const GET_PROJECTS_PARTICIPATIONS_RECEIPT = gql`
  query Get_projects_participations_receipt(
    $participationType: ProjectParticipationEnum!
    $limit: Int
    $page: Int
  ) {
    get_projects_participations_receipt(
      participationType: $participationType
      limit: $limit
      page: $page
    ) {
      result {
        _id
        title
        type
        amount
        status
        createdAt
        description
        project {
          title
        }
      }
      total
    }
  }
`;
