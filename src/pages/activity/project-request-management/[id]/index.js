import Head from "next/head";
import { useState } from "react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useTranslation } from "next-i18next";
import { useWindowSize } from "@uidotdev/usehooks";
import { Edit2, Profile, Trash } from "iconsax-react";
import { useMutation, useQuery } from "@apollo/client";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { USER_DELETE_PROJECT_REQUEST } from "@services/gql/mutation/USER_DELETE_PROJECT_REQUEST";
import { GET_SINGLE_REQUEST_IN_REQUEST_MANAGEMENT } from "@services/gql/query/GET_SINGLE_REQUEST_IN_REQUEST_MANAGEMENT";
//COMPONENT
import Header from "@components/common/Header";
import ColumnList from "@components/common/ColumnList";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import ProjectStatus from "@components/pages/project-management/ProjectStatus";
import dynamic from "next/dynamic";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const CustomModal = dynamic(() => import("@components/kit/modal/CustomModal"), { ssr: false });

export default function ProjectRequestManagementPage({ params }) {
  const { t } = useTranslation();
  const { t: tPM } = useTranslation("project-management");
  const [openDeleteProjectModal, setOpenDeleteProjectModal] = useState(false);
  const router = useRouter();

  const size = useWindowSize();

  const getSingleProjectRequest = useQuery(GET_SINGLE_REQUEST_IN_REQUEST_MANAGEMENT, {
    variables: {
      id: `${params?.id}`,
    },
  });

  const [delete_request] = useMutation(USER_DELETE_PROJECT_REQUEST);
  const deleteRequest = async () => {
    try {
      const {
        data: { user_delete_project_request },
      } = await delete_request({
        variables: {
          projectRequestId: params?.id,
        },
      });
      if (user_delete_project_request.status === 200) {
        router.push("/activity/actions-management", undefined, { shallow: true });
      }
    } catch (error) {
      setOpenDeleteProjectModal(false);
      toast.custom(() => <Toast text={error?.message} status="ERROR" />);
    }
  };

  if (getSingleProjectRequest.loading) return <LoadingScreen />;
  const items = [
    {
      label: t("requestProfile"),
      icon: <Profile size={size.width < 960 ? 20 : 24} />,
      onClick: () =>
        router.push(`/project-request-profile/${params?.id}`, undefined, { shallow: true }),
    },
    {
      label: t("editRequest"),
      icon: <Edit2 size={size.width < 960 ? 20 : 24} />,
      onClick: () => router.push(`/edit-form/${params?.id}`, undefined, { shallow: true }),
      isDisable: getSingleProjectRequest.data?.getSingleProjectRequest.status === "ACTIVE",
    },
    {
      label: tPM("deleteRequest"),
      icon: <Trash size={size.width < 960 ? 20 : 24} />,
      onClick: () => setOpenDeleteProjectModal(true),
      isDisable: false,
    },
  ];

  if (getSingleProjectRequest.error) {
    if (
      getSingleProjectRequest.error.message === "bad request: no such projectRequest found" ||
      getSingleProjectRequest.error.message === "Something bad happend"
    ) {
      router.push("/404", undefined, { shallow: true });
    } else return <h1>{getSingleProjectRequest.error.message}</h1>;
  }

  return (
    <>
      <Head>
        <title>{t("manageRequest")}</title>
      </Head>
      <Header onClick={() => history.back()} title={t("manageRequest")} hasBackButton={false} />

      <main className="pt-[7px] pb-[80px] max-w-[1320px] 2xl:mx-auto">
        <div className="h-[61px] lg:h-[74px] px-4 bg-gray6 flex gap-x-2 lg:gap-x-3 items-center mb-5 lg:mb-9 lg:mx-6">
          {getSingleProjectRequest.data?.getSingleProjectRequest?.imgs && (
            <div className=" relative w-12 lg:w-14 h-12 lg:h-14 rounded-[8px] overflow-hidden shadow-sm">
              <Image
                src={
                  getSingleProjectRequest.data?.getSingleProjectRequest?.imgs?.length !== 0
                    ? getSingleProjectRequest.data.getSingleProjectRequest.imgs[0]
                    : "/assets/images/default-project-card-image.png"
                }
                layout="fill"
                alt={"project-owner-image"}
                className="rounded-[8px] cover-center-img"
              ></Image>
            </div>
          )}
          <h2 className="title1 lg:font-bold lg:text-[18px]">
            {getSingleProjectRequest.data?.getSingleProjectRequest?.title}
          </h2>
        </div>
        <div className="lg:border-gary5 lg:border-[2px] lg:rounded-[14px]  lg:py-4 lg:m-6 lg:mt-0">
          <div className="px-4 pb-[10px] lg:px-6">
            <ProjectStatus
              t={t}
              tPM={tPM}
              status={getSingleProjectRequest.data?.getSingleProjectRequest?.status}
              projectId={params?.id}
              refetch={getSingleProjectRequest.refetch}
              isRequest={true}
            />
          </div>
          <div className="border-t-[10px] border-gray6 lg:border-t-[2px] lg:px-2 pt-4">
            <div className="px-4">
              <ColumnList items={items} />
            </div>
          </div>
        </div>
      </main>
      <CustomModal
        title={tPM("deleteProjectMessageTitle")}
        description={tPM("deleteRequestMessageDescription")}
        openState={openDeleteProjectModal}
        cancelOnClick={() => setOpenDeleteProjectModal(false)}
        okOnClick={deleteRequest}
        hasOneButton={false}
        icon={
          <div className="flex items-center justify-center rounded-full bg-[#FFEBEB] w-[80px] h-[80px]">
            <Trash color="#E53535" size={40} />
          </div>
        }
        okBgColor={"bg-danger"}
        okLabel={t("clear")}
        cancelLabel={t("cancel")}
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
      ...(await serverSideTranslations(locale, ["common", "project-management"])),
      params,
    },
  });
};
