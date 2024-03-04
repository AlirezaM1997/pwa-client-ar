import { gql } from "@apollo/client";

export const GET_BANNERS = gql`
query Get_banners($screenSize: [BannerScreenSizeEnum!], $position: [String!], $page: Int, $limit: Int) {
  get_banners(screenSize: $screenSize, position: $position, page: $page, limit: $limit) {
      image
      order
      position
      url
      type
      screenSize
    }
  }
`;

