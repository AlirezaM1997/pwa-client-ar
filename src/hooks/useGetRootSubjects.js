import { useQuery } from "@apollo/client";
import { GET_ROOT_SUBJECTS } from "@services/gql/query/GET_ROOT_SUBJECTS";

export const useGetRootSubjects = () => {
  const { loading, data, error } = useQuery(GET_ROOT_SUBJECTS);
  return { loading, data, error };
};
