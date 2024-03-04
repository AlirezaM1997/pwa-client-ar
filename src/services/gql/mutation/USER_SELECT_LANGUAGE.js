import { gql } from "@apollo/client";
export const USER_SELECT_LANGUAGE = gql`
  mutation User_select_language($lang: LanguageEnum) {
    user_select_language(lang: $lang) {
      status
    }
  }
`;
