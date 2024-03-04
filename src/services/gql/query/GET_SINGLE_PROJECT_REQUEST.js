import { gql } from "@apollo/client";

export const GET_SINGLE_PROJECT_REQUEST = gql`
  query GetSingleProjectRequest($id: ID!) {
    getSingleProjectRequest(_id: $id) {
      _id
      subjectHasOther
      subjectOtherDescription
      title
      imgs
      bookmarkable
      haveIBookmarked
      tags
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
      subjects {
        name
        _id
        parent {
          name
        }
      }
      requirements {
        _id
        amount
        category {
          _id
          title
        }
        description
        level {
          _id
          title
        }
        subCategory {
          _id
          title
        }
        title
        type
      }
      dueDate
      description
      isAssignedTo
      subjects {
        name
        _id
        parent {
          name
        }
      }
      assigned_to {
        name
        _id
      }
    }
  }
`;
