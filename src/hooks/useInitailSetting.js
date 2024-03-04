import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
//REDUX
import { logOutAction } from "@store/slices/logout";
import { accountsAction } from "@store/slices/accounts";
import { tokenAction } from "@store/slices/token";
//GQL
import { USER_ME } from "@services/gql/query/USER_ME";
import { ASSOCIATION_ME } from "@services/gql/query/ASSOCIATION_ME";
import { REFRESH_TOKEN } from "@services/gql/mutation/REFRESH_TOKEN";

export const useInitailSetting = () => {
  //VARIABLE
  const router = useRouter();
  const [lang, setLang] = useState(getCookie("NEXT_LOCALE") || "en");
  const [fakeLoading, setFakeLoading] = useState(false);
  const dispatch = useDispatch();
  const refreshHash = useSelector((state) => state.token.refreshHash);
  const accounts = useSelector((state) => state.accounts.accounts);
  const token = useSelector((state) => state.token);

  const startSession = sessionStorage.getItem("START_SESSION");

  //API
  const [getUser, { data: userData, loading: userLoading, error: userError }] = useLazyQuery(USER_ME, {
    fetchPolicy: "no-cache",
  });
  const [getAssociation, { data: associationData, loading: associationLoading, error: associationError }] = useLazyQuery(
    ASSOCIATION_ME,
    { fetchPolicy: "no-cache" }
  );
  const [refresh_token_mutation] = useMutation(REFRESH_TOKEN);

  //FUNCTION
  const refreshToken = async (userLang) => {
    try {
      const {
        data: { refresh_token },
      } = await refresh_token_mutation({
        variables: {
          refreshHash,
        },
      });
      if (refresh_token._id) {
        dispatch(
          accountsAction({
            accounts: accounts.map((item) =>
              item._id !== token._id
                ? item
                : {
                  ...item,
                  token: refresh_token.token,
                  refreshHash: refresh_token.refreshHash,
                }
            ),
          })
        );
        dispatch(
          tokenAction({
            token: refresh_token.token,
            refreshHash: refresh_token.refreshHash,
            _id: token._id,
          })
        );
        sessionStorage.setItem("START_SESSION", "true");
        if (lang !== userLang) {
          document.location.replace(`/${userLang}${router.asPath}`);
        }
      }
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    if (startSession) {
      setFakeLoading(false);
    } else {
      setFakeLoading(true);
      getUser();
      getAssociation();
    }
  }, [startSession]);

  useEffect(() => {
    //HANDLE-LANGUAGE
    if (startSession) {
      return;
    } else {
      if (!userLoading && !associationLoading) {
        if (userData || associationData) {
          if (userData?.user_me?.isBanned || associationData?.association_me?.isBanned) {
            dispatch(logOutAction(true));
            localStorage.clear();
            sessionStorage.clear();
            setFakeLoading(false);
            sessionStorage.setItem("START_SESSION", "true");
          } else {
            const userLang = userData?.user_me.lang || associationData?.association_me.lang;
            setLang(userLang);
            setCookie("NEXT_LOCALE", userLang);
            refreshToken(userLang);
          }
        } else {
          const _lang = getCookie("NEXT_LOCALE");
          setCookie("NEXT_LOCALE", _lang ?? "en");
          const errorMessage = userError?.message || associationError?.message
          if (errorMessage === "Token required" ||
            errorMessage === "Token has been expired" ||
            errorMessage === "Authorization failed" ||
            errorMessage === "Forbidden access"
          ) {
            dispatch(accountsAction({ accounts: [] }));
            dispatch(tokenAction({ token: "", refreshHash: "", _id: "" }));
          }
          if (errorMessage) {
            setFakeLoading(false);
            sessionStorage.setItem("START_SESSION", "true");
          }
        }
      }
    }
  }, [userData, associationData, userLoading, associationLoading, startSession]);

  return { lang, fakeLoading };
};
