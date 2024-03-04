import { gql } from "@apollo/client";

export const GET_SETAD_LIST = gql`
  query getSetadList($page: Int, $limit: Int) {
    get_setad_list(page: $page, limit: $limit) {
      total
      result {
        _id
        image
        name
      }
    }
  }`