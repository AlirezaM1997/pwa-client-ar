import { gql } from "@apollo/client";
export const REPORT = gql`
  mutation Report($data: ReportInfo!) {
    report(data: $data) {
      status
    }
  }
`;