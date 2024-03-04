import { gql } from "@apollo/client";

export const GET_SINGLE_PROJECT = gql`
  query GetSingleProject($id: ID!) {
    getSingleProject(_id: $id) {
      _id   
      averageScore
      haveIRated
      tags
      IhadActivity
      subjectHasOther
      subjectOtherDescription
      title
      imgs
      haveIBookmarked
      bookmarkable
      subjects {
        name
        _id
        parent {
          name
        }
      }
      location {
        address
        geo {
          lat
          lon
        }
      }
      creator {
        name
        _id
        verifyBadge
      }
      participationCount
      participationStatistics {
        total
      }
      projectRequirementData {
        donatePercentage
        participationsCount
        participationsFinancialAmount
        totalFinancialAmount
      }
      requirements {
        _id
        amount
        description
        title
        type
      }
      description
      isAssignedTo
      participationCount
      haveILiked
      likeCount
      projectStatus {
        status
      }
      associationObject {
        audience {
          gender
          maxAge
          minAge
        }
        startDate
        endDate
      }
      assigned_to {
        name
        _id
      }
    }
  }
`;

