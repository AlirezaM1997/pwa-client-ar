import { gql } from "@apollo/client";

export const ASSOCIATION_AUTH_STEP_ONE = gql`
  mutation Association_auth_stepOne(
    $phoneNumber: PhoneNumber!
    $platform: PlatformTypeEnum!
    $origin: OriginEnum!
  ) {
    association_auth_stepOne(phoneNumber: $phoneNumber, platform: $platform, origin: $origin) {
      status
    }
  }
`;
