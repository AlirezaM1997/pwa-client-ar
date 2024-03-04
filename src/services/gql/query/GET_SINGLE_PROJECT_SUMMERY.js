import { gql } from "@apollo/client";

export const GET_SINGLE_PROJECT_SUMMERY = gql`
  query GetSingleProject($id: ID!) {
    getSingleProject(_id: $id) {
      _id
      title
      projectStatus {
        status
      }
      haveILiked
      subjectOtherDescription
      likeCount
      haveIBookmarked
      bookmarkable
      imgs
      requirements {
        type
      }
      projectRequirementData {
        donatePercentage
        participationsCount
        participationsFinancialAmount
        totalFinancialAmount
      }
      subjects {
        name
        parent {
          name
        }
      }
      isAssignedTo
      description
      assigned_to {
        name
      }
      averageScore
    }
  }
`;
