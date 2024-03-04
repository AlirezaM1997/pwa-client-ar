import { gql } from "@apollo/client";

export const UPLOAD_IMAGE_BASE64 = gql`
  mutation Upload_image_base64($image: Base64ImageInput!) {
    upload_image_base64(image: $image) {
      url
    }
  }
`;
