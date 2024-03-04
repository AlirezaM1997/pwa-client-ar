import Head from "next/head";
import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { getCookie } from "cookies-next";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "@uidotdev/usehooks";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MessageText } from "iconsax-react";
import { useSelector } from "react-redux";
//GQL
import { GET_SETAD_PROFILE } from "@services/gql/query/GET_SETAD_PROFILE";
import { ASSOCIATION_SUBMIT_LICENSE_REQUEST } from "@services/gql/mutation/ASSOCIATION_SUBMIT_LICENSE_REQUEST";
import { ASSOCIATION_GET_LICENSE_REQUEST_STATUS } from "@services/gql/query/ASSOCIATION_GET_LICENSE_REQUEST_STATUS";
import { ASSOCIATION_GET_BELONGING_request_status } from "@services/gql/query/ASSOCIATION_GET_BELONGING_REQUEST_STATUS";
import { ASSOCIATION_SUBMIT_BELONGING_REQUEST } from "@services/gql/mutation/ASSOCIATION_SUBMIT_BELONGING_REQUEST";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";
import SetadProfile from "@components/pages/setad-profile/Main";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import TextareaInput from "@components/kit/Input/TextareaInput";
import CustomTransitionModal from "@components/kit/modal/CustomTransitionModal";
import ViolationReportBottomSheet from "@components/common/ViolationReportBottomSheet";
// COMPONENT DYNAMIC IMPORT
const ShareModal = dynamic(() => import("@components/common/ShareModal"), { ssre: false });
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const SingleImageViewer = dynamic(() => import("@components/common/SingleImageViewer"), {
  ssre: false,
});
const ShowFullScreenLocation = dynamic(() => import("@components/common/ShowFullScreenLocation"), {
  ssr: false,
});

export default function SetadProfilePage({ params }) {
  //VARIABLE
  const { t } = useTranslation();
  const size = useWindowSize();
  const lang = getCookie("NEXT_LOCALE");
  const isUser = useSelector((state) => state.isUser.isUser);
  const [openShare, setOpenShare] = useState(false);
  const [showFullScreenMap, setShowFullScreenMap] = useState(false);
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [openReport, setOpenReport] = useState(false);
  const [openLicenseRequestDescription, setOpenLicenseRequestDescription] = useState(false);

  //API

  const [submitBelongingRequestMutation] = useMutation(ASSOCIATION_SUBMIT_BELONGING_REQUEST);
  const [submitLicenseRequestMutation] = useMutation(ASSOCIATION_SUBMIT_LICENSE_REQUEST);

  const { loading, error, data, refetch } = useQuery(GET_SETAD_PROFILE, {
    variables: {
      setadId: params?.id,
    },
  });

  const {
    loading: licenseStatusLoading,
    data: licenseStatusData,
    refetch: licenseStatusRefetch,
  } = useQuery(ASSOCIATION_GET_LICENSE_REQUEST_STATUS, {
    variables: {
      setadId: params?.id,
    },
  });

  const {
    loading: belongingStatusLoading,
    data: belongingStatusData,
    refetch: belongingStatusRefetch,
  } = useQuery(ASSOCIATION_GET_BELONGING_request_status, {
    variables: { setadId: params?.id },
  });

  const licenseRequestStatus = licenseStatusData?.association_get_license_request_status;
  const belongingRequestStatus = belongingStatusData?.association_get_belonging_request_status;

  const submitLicenseRequest = async (description) => {
    setOpenLicenseRequestDescription(false);

    const variables = {
      setadId: params?.id,
      description,
    };

    try {
      const {
        data: { association_submit_license_request },
      } = await submitLicenseRequestMutation({ variables });
      if (association_submit_license_request.status === 200) {
        licenseStatusRefetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitBelongingRequest = async () => {
    const variables = {
      setadId: params?.id,
    };

    try {
      const {
        data: { association_submit_belonging_request },
      } = await submitBelongingRequestMutation({ variables });
      if (association_submit_belonging_request.status === 200) {
        belongingStatusRefetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //COMPONENT
  const AddDescription = () => {
    const [licenseRequestDescription, setLicenseRequestDescription] = useState("");
    return (
      <div className="px-4 pb-[14px] lg:p-6">
        <TextareaInput
          t={t}
          value={licenseRequestDescription}
          setValue={setLicenseRequestDescription}
          maxLength={1000}
          labelText={t("description") + " " + `(${t("optional")})`}
          icon={<MessageText size={16} />}
          characterCount={licenseRequestDescription?.length}
          showMaxLengthLabel={true}
        />
        <div className="lg:mt-3">
          <CustomButton
            title={t("confirmDes")}
            onClick={() => submitLicenseRequest(licenseRequestDescription)}
            isFullWidth={true}
            size="M"
          />
        </div>
      </div>
    );
  };

  //JSX
  if (error) return <h5>{error?.message}</h5>;
  if (loading || licenseStatusLoading || belongingStatusLoading) return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>{data?.get_setad_profile.name}</title>
      </Head>

      <SetadProfile
        data={data?.get_setad_profile}
        refetch={refetch}
        setOpenShare={setOpenShare}
        setProfileImageUrl={setProfileImageUrl}
        setShowProfileImage={setShowProfileImage}
        setShowFullScreenMap={setShowFullScreenMap}
        setOpenReport={setOpenReport}
      />

      {!isUser && (
        <div className="flex gap-x-2 px-4 lg:px-8 w-full fixed lg:static bottom-0 lg:mt-[30px] bg-white lg:bg-transparent shadow lg:shadow-none max-w-[1320px] 2xl:mx-auto pb-5 pt-3 lg:pb-[50px] lg:pt-0 z-10">
          <CustomButton
            title={
              !licenseRequestStatus
                ? t("licenseRequest")
                : licenseRequestStatus === "PENDING"
                ? t("licenseRequestPending")
                : licenseRequestStatus === "APPROVED"
                ? t("licenseRequestApproved")
                : t("licenseRequestRejected")
            }
            onClick={() => setOpenLicenseRequestDescription(true)}
            isFullWidth={true}
            size="M"
            isPointerEventsNone={licenseRequestStatus && licenseRequestStatus !== "REJECTED"}
            bgColor={
              !licenseRequestStatus
                ? "bg-main2"
                : licenseRequestStatus === "PENDING"
                ? "bg-warning"
                : licenseRequestStatus === "APPROVED"
                ? "bg-success"
                : "bg-danger"
            }
          />
          <CustomButton
            title={
              !belongingRequestStatus
                ? t("requestToBelong")
                : belongingRequestStatus === "PENDING"
                ? t("belongingRequestPending")
                : belongingRequestStatus === "APPROVED"
                ? t("belongingRequestApproved")
                : t("belongingRequestRejected")
            }
            onClick={() => submitBelongingRequest()}
            isPointerEventsNone={
              belongingRequestStatus &&
              (belongingRequestStatus === "PENDING" || belongingRequestStatus === "APPROVED")
            }
            bgColor={
              !belongingRequestStatus
                ? "bg-main2"
                : belongingRequestStatus === "PENDING"
                ? "bg-warning"
                : belongingRequestStatus === "APPROVED"
                ? "bg-success"
                : "bg-danger"
            }
            isFullWidth={true}
            size="M"
          />
        </div>
      )}

      <ShareModal
        t={t}
        data={data.get_setad_profile}
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
          lat={data.get_setad_profile.location.geo?.lat}
          lng={data.get_setad_profile.location.geo?.lon}
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
        targetType="SETAD"
        targetId={data?.get_setad_profile._id}
      />

      {size.width < 960 ? (
        <BottomSheet
          open={openLicenseRequestDescription}
          setOpen={setOpenLicenseRequestDescription}
        >
          <AddDescription />
        </BottomSheet>
      ) : (
        <CustomTransitionModal
          open={openLicenseRequestDescription}
          close={() => setOpenLicenseRequestDescription(false)}
          width="500px"
        >
          <AddDescription />
        </CustomTransitionModal>
      )}
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
