import { gql } from "@apollo/client";

export const GET_ASSOCIATION_BYID_SUMMERY = gql`
  query Get_association_byId($id: ID!) {
    get_association_byId(_id: $id) {
      _id
      name
      bio
      verifyBadge
      image
      averageScore
      scoreCount
      followerCount
      projectsCount
      followingCount
    }
  }
`;


