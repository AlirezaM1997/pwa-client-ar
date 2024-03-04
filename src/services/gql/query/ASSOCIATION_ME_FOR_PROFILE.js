import { gql } from "@apollo/client";

export const ASSOCIATION_ME_FOR_PROFILE = gql`
  query Association_me {
    association_me {
      _id
      role
      image
      prename
      justName
      bio
      lang
      missionStatement
      publicPhone
      phoneNumber
      scoreCount
      email
      location {
        address
        geo {
          lat
          lon
        }
      }
      followerCount
      followingCount
      participatorsCount
      projectsCount
      averageScore
      hasAction
      verifyBadge
    }
  }
`;
