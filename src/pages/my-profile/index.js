import Head from "next/head";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useLazyQuery } from "@apollo/client";
import { logOutAction } from "@store/slices/logout";
import { useDispatch, useSelector } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { USER_ME_FOR_PROFILE } from "@services/gql/query/USER_ME_FOR_PROFILE";
import { ASSOCIATION_ME_FOR_PROFILE } from "@services/gql/query/ASSOCIATION_ME_FOR_PROFILE";
//COMPONENT
import MyProfileSkeleton from "@components/common/skeleton/MyProfileSkeleton";
// COMPONENT DYNAMIC IMPORT
const MyProfile = dynamic(() => import("@components/pages/my-profile/Main"), {
  ssr: false,
});

export default function MyProfilePage() {
  //VARIABLE
  const { t } = useTranslation();
  const { t: tP } = useTranslation("profile");
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const isUser = useSelector((state) => state.isUser.isUser);

  //API
  const [getUser, { data: userData, loading: userLoading, error: userError }] = useLazyQuery(
    USER_ME_FOR_PROFILE,
    { fetchPolicy: "no-cache" }
  );
  const [
    getAssociation,
    { data: associationData, loading: associationLoading, error: associationError },
  ] = useLazyQuery(ASSOCIATION_ME_FOR_PROFILE, { fetchPolicy: "no-cache" });

  //FUNCTION
  useEffect(() => {
    if (isUser) {
      getUser();
    } else {
      getAssociation();
    }
  }, []);

  //JSX
  if (userLoading || associationLoading || loading) return <MyProfileSkeleton />;

  if (isUser) {
    if (userError) {
      dispatch(logOutAction(true));
      sessionStorage.clear();
      localStorage.clear();
      router.push("/login", undefined, { shallow: true });
    }
  } else {
    if (associationError) {
      dispatch(logOutAction(true));
      sessionStorage.clear();
      localStorage.clear();
      router.push("/login", undefined, { shallow: true });
    }
  }

  if (!userError && !associationError) {
    return (
      <>
        <NextSeo title={"mofidapp"} description={"mofidapp"} />

        <Head>
          <title>{t("myProfile")}</title>
        </Head>

        <MyProfile
          t={t}
          tP={tP}
          lang={lang}
          data={userData?.user_me ? userData.user_me : associationData?.association_me}
          setLoading={setLoading}
          isAssociation={userData?.user_me ? false : true}
        />
      </>
    );
  }
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["profile", "common"])),
    },
  };
}
