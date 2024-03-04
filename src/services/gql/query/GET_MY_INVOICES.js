import { gql } from "@apollo/client";

export const GET_MY_INVOICES = gql`
  query Get_my_invoices($page: Int, $limit: Int) {
    get_my_invoices(page: $page, limit: $limit) {
      result {
        _id
        amount
        createdAt
        status
      }
      total
    }
  }
`;

