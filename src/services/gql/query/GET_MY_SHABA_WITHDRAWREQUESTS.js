import { gql } from "@apollo/client";

export const GET_MY_SHABA_WITHDRAWREQUESTS = gql`
  query Get_my_withdrawRequests($status: WithdrawRequestStatusEnum, $page: Int, $limit: Int) {
    get_my_withdrawRequests(status: $status, page: $page, limit: $limit) {
      result {
        amount
        status
        description
        wallet {
          _id
          shabaNumber
          cartNumber
          bankName
          text
        }
        trackingNo
        createdAt
      }
      total
    }
  }
`;

