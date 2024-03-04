
import { gql } from "@apollo/client";

export const ZARINPAL_FINANCIAL_PARTICIPATION = gql`
  mutation Zarinpal_financial_participation($projectId: ID!, $amount: Int!, $redirectTo: String, $src: String) {
    zarinpal_financial_participation(projectId: $projectId, amount: $amount, redirectTo: $redirectTo, src: $src)
  }
`;