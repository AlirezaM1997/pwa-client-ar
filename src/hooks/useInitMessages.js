import { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { setMessageAction } from "@store/slices/message";
import { useDispatch } from "react-redux";
import { GET_ME_CHAT } from "@services/gql/query/GET_ME_CHAT";
import { GET_MY_CHAT } from "@services/gql/query/GET_MY_CHAT";
import { useRouter } from "next/router";

export const useInitMessages = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [fetchData, { data }] = useLazyQuery(GET_ME_CHAT, { fetchPolicy: "no-cache" });

  useEffect(() => {
    if (!data) fetchData();
    if (data) dispatch(setMessageAction(data.get_my_chat));
  }, [data]);

  const getMyChat = useQuery(GET_MY_CHAT);

  useEffect(() => {
    if (
      getMyChat.error &&
      (getMyChat.error.message === "Authorization failed" ||
        getMyChat.error.message === "Token required")
    ) {
      router.push("/login", undefined, { shallow: true });
      setIsLoading(false);
    }
  }, [getMyChat?.error]);

  useEffect(() => {
    if (!getMyChat?.loading) {
      if (getMyChat?.data?.get_my_chat) setIsLoading(false);
    }
  }, [getMyChat?.loading, getMyChat?.data?.get_my_chat]);

  return { isLoading };
};
