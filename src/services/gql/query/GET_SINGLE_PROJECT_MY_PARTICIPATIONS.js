import { gql } from "@apollo/client";

export const GET_SINGLE_PROJECT_MY_PARTICIPATIONS = gql`
  query GetSingleProject($id: ID!) {
    getSingleProject(_id: $id) {
      myParticipations {
        type
        amount
        createdAt
        description
        status
        participator {
          name
        }
        title
      }
    }
  }
`;

