import { gql } from "@apollo/client";

export const GET_HQ_PROFILE = gql`
  query Get_hq_profile($hqId: ID!) {
    get_hq_profile(HQId: $hqId) {
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
      setadName
      setadId
      setadImage
    }
  }
`;
