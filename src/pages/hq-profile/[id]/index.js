import Head from "next/head";
import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { getCookie } from "cookies-next";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { GET_HQ_PROFILE } from "@services/gql/query/GET_HQ_PROFILE";
//COMPONENT
import HqProfile from "@components/pages/hq-profile/Main";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import ViolationReportBottomSheet from "@components/common/ViolationReportBottomSheet";
// COMPONENT DYNAMIC IMPORT
const ShareModal = dynamic(() => import("@components/common/ShareModal"), { ssr: false });
const SingleImageViewer = dynamic(() => import("@components/common/SingleImageViewer"), {
  ssr: false,
});
const ShowFullScreenLocation = dynamic(() => import("@components/common/ShowFullScreenLocation"), {
  ssr: false,
});

export default function HqProfilePage({ params }) {
  //VARIABLE
  const { t } = useTranslation();
  const lang = getCookie("NEXT_LOCALE");
  const [openShare, setOpenShare] = useState(false);
  const [showFullScreenMap, setShowFullScreenMap] = useState(false);
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [openReport, setOpenReport] = useState(false);

  //API
  const { loading, error, data, refetch } = useQuery(GET_HQ_PROFILE, {
    variables: {
      hqId: params?.id,
    },
  });

  //JSX
  if (error) return <h5>{error?.message}</h5>;
  if (loading) return <LoadingScreen />;
  return (
    <>
      <Head>
        <title>{data?.get_hq_profile.name}</title>
      </Head>

      <HqProfile
        data={data?.get_hq_profile}
        refetch={refetch}
        setOpenShare={setOpenShare}
        setProfileImageUrl={setProfileImageUrl}
        setShowProfileImage={setShowProfileImage}
        setShowFullScreenMap={setShowFullScreenMap}
        setOpenReport={setOpenReport}
      />

      <ShareModal
        t={t}
        data={data.get_hq_profile}
        open={openShare}
        shareLink={`${process.env.NEXT_PUBLIC_PUBLISH_DOMAIN}/${lang}/setad-profile/${params?.id}`}
        close={() => {
          setOpenShare(false);
          toast.remove();
        }}
      />

      {showFullScreenMap && (
        <ShowFullScreenLocation
          showFullScreenMap={showFullScreenMap}
          setShowFullScreenMap={setShowFullScreenMap}
          lat={data.get_hq_profile.location.geo?.lat}
          lng={data.get_hq_profile.location.geo?.lon}
        />
      )}

      <SingleImageViewer
        open={showProfileImage}
        setOpen={setShowProfileImage}
        url={profileImageUrl}
        setUrl={setProfileImageUrl}
      />

      <ViolationReportBottomSheet
        lang={lang}
        t={t}
        setOpenViolationReportBottomSheet={setOpenReport}
        openViolationReportBottomSheet={openReport}
        targetType="HQ"
        targetId={data?.get_hq_profile._id}
      />
    </>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params, locale }) => {
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      params,
    },
  });
};
