import { gql } from "@apollo/client";

export const RATE_PROJECT = gql`
  mutation Rate_project($data: RateInput!) {
    rate_project(data: $data) {
      status
    }
  }
`;