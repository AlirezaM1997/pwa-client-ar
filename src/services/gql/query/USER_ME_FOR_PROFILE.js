import { gql } from "@apollo/client";

export const USER_ME_FOR_PROFILE = gql`
  query User_me {
    user_me {
      _id
      prename
      justName
      role
      bio
      lang
      followingCount
      participatorsCount
      averageScore
      projectsCount
      phoneNumber
      image
      roleSpeceficInformaton {
        birthDate
        gender
      }
      location {
        address
        geo {
          lat
          lon
        }
      }
    }
  }
`;

