import { gql } from "@apollo/client";

export const USER_AUTH_STEP_ONE = gql`
  mutation User_auth_stepOne(
    $phoneNumber: PhoneNumber!
    $platform: PlatformTypeEnum!
    $origin: OriginEnum!
  ) {
    user_auth_stepOne(phoneNumber: $phoneNumber, platform: $platform, origin: $origin) {
      status
    }
  }
`;
