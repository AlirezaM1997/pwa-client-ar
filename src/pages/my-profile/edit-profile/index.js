import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { USER_ME_FOR_PROFILE } from "@services/gql/query/USER_ME_FOR_PROFILE";
import { ASSOCIATION_ME_FOR_PROFILE } from "@services/gql/query/ASSOCIATION_ME_FOR_PROFILE";
//COMPONENT
import Header from "@components/common/Header";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import EditProfile from "@components/pages/my-profile/EditProfile";

export default function EditProfilePage() {
  const { t: tP } = useTranslation("profile");
  const { t } = useTranslation();
  const router = useRouter();
  const user = useQuery(USER_ME_FOR_PROFILE, { fetchPolicy: "no-cache" });
  const association = useQuery(ASSOCIATION_ME_FOR_PROFILE, { fetchPolicy: "no-cache" });

  if (user.loading || association.loading) return <LoadingScreen />;
  if (
    (user?.error?.message === "Authorization failed" ||
      user?.error?.message === "Token required") &&
    (association?.error?.message === "Authorization failed" ||
      association?.error?.message === "Token required")
  ) {
    router.push("/login", undefined, { shallow: true });
  }
  return (
    <div className="pb-[70px]">
      <Head>
        <title className="">{t("information")}</title>
      </Head>
      <Header
        title={t("information")}
        onClick={() => {
          router.back();
        }}
      />
      <EditProfile
        t={t}
        tP={tP}
        isAssociation={user.data?.user_me ? false : true}
        data={user.data?.user_me ? user.data.user_me : association.data?.association_me}
        classNames="pb-16 px-4 mt-[-10px] lg:mt-[4px] max-w-[1320px] 2xl:mx-auto"
      />
    </div>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["profile", "common"])),
    },
  };
}
