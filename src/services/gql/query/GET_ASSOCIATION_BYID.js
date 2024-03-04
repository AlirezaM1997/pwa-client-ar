import { gql } from "@apollo/client";

export const GET_ASSOCIATION_BYID = gql`
  query Get_association_byId($id: ID!) {
    get_association_byId(_id: $id) {
      _id
      verifyBadge
      image
      averageScore
      followerCount
      projectsCount
      followingCount
      bio
      missionStatement
      name
      justName
      publicPhone
      email
      location {
        address
        geo {
          lat
          lon
        }
      }
      haveIfollowed
      serviceCount
      scoreCount
      participatorsCount
    }
  }
`;
