import { gql } from "@apollo/client"

export const GET_LOGGEDIN_USERS = gql`
  query GetLoggedInUsers($ids: [String!]!) {
    getLoggedInUsers(ids: $ids) {
      image
      _id
      name
      phoneNumber
      role
      lang
    }
  }
`
