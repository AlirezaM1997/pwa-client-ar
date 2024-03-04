import { gql } from "@apollo/client";

export const GET_PARTICIPATIONS_RECEIPT = gql`
  query Result(
    $projectId: ID!
    $participationType: [ProjectParticipationEnum!]
    $limit: Int
    $page: Int
  ) {
    get_participations_receipt(
      projectId: $projectId
      participationType: $participationType
      limit: $limit
      page: $page
    ) {
      result {
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
