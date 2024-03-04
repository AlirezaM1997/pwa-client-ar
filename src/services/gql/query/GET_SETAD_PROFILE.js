import { gql } from "@apollo/client";

export const GET_SETAD_PROFILE = gql`
  query Get_setad_profile($setadId: ID!) {
    get_setad_profile(setadId: $setadId) {
      _id
      description
      image
      name
      publicPhone
      location {
        address
        geo {
          lat
          lon
        }
      }
      weburl
    }
  }
`;
