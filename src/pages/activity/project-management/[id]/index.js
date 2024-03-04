import Head from "next/head";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useWindowSize } from "@uidotdev/usehooks";
import { useMutation, useQuery } from "@apollo/client";
import { ChartSquare, Edit2, Profile, Trash } from "iconsax-react";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// FUNCTION
import { getDate } from "@functions/getDate";
//GQL
import { ASSOCIATION_DELETE_PROJECT } from "@services/gql/mutation/ASSOCIATION_DELETE_PROJECT";
import { GET_PROJECT_VISIT_STATISTICS } from "@services/gql/query/GET_PROJECT_VISITE_STATISTICS";
import { GET_PROJECT_FINANCIAL_STATISTICS } from "@services/gql/query/GET_PROJECT_FINANCIAL_STATISTICS";
import { GET_PROJECT_PARTICIPATIONS_STATISTICS } from "@services/gql/query/GET_PROJECT_PARTICIPATIONS_STATISTICS";
import { GET_SINGLE_PROJECT_IN_PROJECT_MANAGEMENT } from "@services/gql/query/GET_SINGLE_PROJECT_IN_PROJECT_MANAGEMENT";
//COMPONENT
import Header from "@components/common/Header";
import ColumnList from "@components/common/ColumnList";
import CustomButton from "@components/kit/button/CustomButton";
import ProjectStatus from "@components/pages/project-management/ProjectStatus";
import ProjectManagementSkeleton from "@components/common/skeleton/ProjectManagementSkeleton";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const LineChart = dynamic(() => import("@components/common/chart/LineChart"), { ssr: false });
const CustomModal = dynamic(() => import("@components/kit/modal/CustomModal"), { ssr: false });
const ColumnChart = dynamic(() => import("@components/common/chart/ColumnChart"), { ssr: false });

export default function ProjectManagementPage({ params }) {
  const { t } = useTranslation();
  const { t: tPM } = useTranslation("project-management");
  const lang = getCookie("NEXT_LOCALE");
  const [openDeleteProjectModal, setOpenDeleteProjectModal] = useState(false);
  const router = useRouter();

  const [financialChart, setFinancialChart] = useState(null);
  const [allParticipationsChart, setAllParticipationsChart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const size = useWindowSize();

  const getSingleProject = useQuery(GET_SINGLE_PROJECT_IN_PROJECT_MANAGEMENT, {
    variables: {
      id: `${params?.id}`,
    },
    fetchPolicy: "no-cache",
  });
  const getProjectFinancialStatistics = useQuery(GET_PROJECT_FINANCIAL_STATISTICS, {
    variables: {
      projectId: `${params?.id}`,
    },
  });
  const getProjectParticipationsStatistics = useQuery(GET_PROJECT_PARTICIPATIONS_STATISTICS, {
    variables: {
      projectId: `${params?.id}`,
    },
  });
  const getProjectVisitStatistics = useQuery(GET_PROJECT_VISIT_STATISTICS, {
    variables: {
      projectId: `${params?.id}`,
    },
  });

  const projectStatus = getSingleProject.data?.getSingleProject?.projectStatus?.status;

  useEffect(() => {
    if (getProjectFinancialStatistics.data) {
      setFinancialChart(getProjectFinancialStatistics.data?.get_project_financial_statistics);
    }
    if (getProjectParticipationsStatistics.data) {
      setAllParticipationsChart(
        getProjectParticipationsStatistics.data?.get_project_participations_statistics
      );
    }
  }, [getProjectFinancialStatistics.data, getProjectParticipationsStatistics.data]);

  if (
    getProjectParticipationsStatistics?.error?.message === "Authorization failed" ||
    getProjectParticipationsStatistics?.error?.message === "Token required"
  ) {
    router.push("/login", undefined, { shallow: true });
  }
  if (getProjectParticipationsStatistics?.error?.message === "Poject does not belong to you") {
    router.push("/404", undefined, { shallow: true });
  }

  const [delete_project] = useMutation(ASSOCIATION_DELETE_PROJECT);
  const deleteProject = async () => {
    setIsLoading(true);
    try {
      const {
        data: { association_delete_project },
      } = await delete_project({
        variables: {
          projectId: params?.id,
        },
      });
      if (association_delete_project.status === 200) {
        router.push("/activity/actions-management", undefined, { shallow: true });
      }
    } catch (error) {
      setIsLoading(false);
      toast.custom(() => <Toast text={error?.message} />);
    }
  };

  if (
    getSingleProject.loading ||
    !allParticipationsChart ||
    !financialChart ||
    !getProjectVisitStatistics?.data ||
    getProjectVisitStatistics?.loading ||
    isLoading
  )
    return <ProjectManagementSkeleton />;

  const items = [
    {
      label: tPM("participationsManagement"),
      icon: <ChartSquare size={size.width < 960 ? 20 : 24} />,
      onClick: () => {
        router.push(`/activity/participation-management/${params?.id}`, undefined, {
          shallow: true,
        });
        setIsLoading(true);
      },
      isDisable: projectStatus === "PENDING" ? true : false,
    },
    {
      label: t("projectProfile"),
      icon: <Profile size={size.width < 960 ? 20 : 24} />,
      onClick: () => {
        router.push(`/project-profile/${params?.id}`, undefined, { shallow: true });
        setIsLoading(true);
      },
    },
    {
      label: t("editProject"),
      icon: <Edit2 size={size.width < 960 ? 20 : 24} />,
      onClick: () => {
        router.push(`/edit-form/${params?.id}`, undefined, { shallow: true });
        setIsLoading(true);
      },
      isDisable:
        projectStatus === "PENDING" || projectStatus === "ACTIVE" || projectStatus === "REJECTED"
          ? false
          : true,
    },
    {
      label: tPM("deleteProject"),
      icon: <Trash size={size.width < 960 ? 20 : 24} />,
      onClick: () => setOpenDeleteProjectModal(true),
      isDisable: projectStatus === "ARCHIVED" ? true : false,
    },
  ];

  return (
    <>
      <Head>
        <title>{t("manageProject")}</title>
      </Head>
      <Header title={t("manageProject")} hasBackButton={false} />
      <main className="pt-[7px] pb-[80px] max-w-[1320px] 2xl:mx-auto">
        <div className="h-[61px] lg:h-[74px] px-4 bg-gray6 flex gap-x-2 lg:gap-x-3 items-center mb-5 lg:mb-9 lg:mx-6">
          {getSingleProject.data?.getSingleProject?.imgs && (
            <div className=" relative w-12 lg:w-14 h-12 lg:h-14 rounded-[8px] overflow-hidden shadow-sm">
              <Image
                src={
                  getSingleProject.data?.getSingleProject?.imgs?.length !== 0
                    ? getSingleProject.data.getSingleProject.imgs[0]
                    : "/assets/images/default-project-card-image.png"
                }
                layout="fill"
                alt={"project-owner-image"}
                className="rounded-[8px] cover-center-img"
              ></Image>
            </div>
          )}
          <h2 className="title1 lg:font-bold lg:text-[18px]">
            {getSingleProject.data?.getSingleProject?.title}
          </h2>
        </div>
        <div className="lg:border-gary5 lg:border-[2px] lg:rounded-[14px]  lg:py-4 lg:m-6 lg:mt-0">
          <div className="px-4 pb-[10px] lg:px-6">
            <ProjectStatus
              t={t}
              tPM={tPM}
              status={projectStatus}
              projectId={params?.id}
              refetch={getSingleProject.refetch}
            />
          </div>
          <div className="border-t-[10px] border-gray6 lg:border-t-[2px] lg:px-2 pt-4">
            <div className="px-4">
              <ColumnList items={items} />
            </div>
          </div>
        </div>
        {projectStatus !== "PENDING" && (
          <div className="lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="border-t-[10px] border-gray6 pt-4 lg:border-gary5 lg:border-[2px] lg:rounded-[14px] lg:m-6">
              <h1 className="heading px-4 lg:border-gray5 lg:border-b-[2px] lg:pb-7 lg:pt-3 lg:px-6 lg:text-[24px] lg:font-bold ">
                {tPM("financilaChartTitle")}
              </h1>
              <div className="flex items-center justify-between px-4 pt-5 lg:px-4 lg:pt-9 ">
                <p className="caption2 lg:text-[16px] lg:font-light">{tPM("allDonation")}</p>
                <p className="cta1">
                  {financialChart.total} {t("toman")}
                </p>
              </div>
              <div className="px-1 lg:px-3 pr-[4%] relative">
                <LineChart
                  data={financialChart?.result?.map((i) => i?.amountPerDay)}
                  categories={financialChart?.result?.map((i) => getDate(i?.date, lang))}
                />
                <div className="w-full flex justify-center absolute-center-x bottom-7">
                  <CustomButton
                    title={tPM("withdrawal")}
                    styleType="Primary"
                    size={"XS"}
                    onClick={() => {
                      size.width < 960
                        ? router.push("/wallet/withdrawal", undefined, { shallow: true })
                        : router.push("/wallet");
                    }}
                    width="w-[84%]"
                    isDisabled={financialChart.total === 0}
                    isPointerEventsNone={financialChart.total === 0}
                  />
                </div>
              </div>
            </div>

            <div className="border-t-[10px] border-gray6 pt-4 lg:border-gary5 lg:border-[2px] lg:rounded-[14px] lg:m-6 ">
              <h1 className="heading px-4 lg:border-gray5 lg:border-b-[2px]  lg:pb-7 lg:pt-3 lg:px-6  lg:text-[24px]  lg:font-bold ">
                {tPM("numOfProjectStatisticsTitle")}
              </h1>
              <div className="flex items-center justify-between px-4 pt-5 lg:pt-9 ">
                <p className="caption2 lg:text-[16px] lg:font-light">{tPM("totalDonation")}</p>
                <p className="cta1">
                  {allParticipationsChart.total} {t("donate")}
                </p>
              </div>
              <div className="px-1 pr-[4%]">
                <ColumnChart
                  total={allParticipationsChart.total}
                  data={[
                    allParticipationsChart.financial,
                    allParticipationsChart.moral,
                    allParticipationsChart.capacity,
                    allParticipationsChart.ideas,
                    allParticipationsChart.presence,
                    allParticipationsChart.skill,
                  ]}
                  categories={[
                    t("requirements.financial"),
                    t("requirements.moral"),
                    t("requirements.capacity"),
                    t("requirements.ideas"),
                    t("requirements.pressence"),
                    t("requirements.skill"),
                  ]}
                />
              </div>
            </div>

            <div className="border-t-[10px] border-gray6 pt-4 lg:border-gary5 lg:border-[2px] lg:rounded-[14px] lg:m-6">
              <h1 className="heading px-4 lg:border-gray5 lg:border-b-[2px] lg:pb-7 lg:pt-3 lg:px-6  lg:text-[24px]  lg:font-bold ">
                {tPM("visitStatisticsTitle")}
              </h1>
              <div className="flex items-center justify-between px-4 pt-5 lg:pt-9">
                <p className="caption2">{tPM("allVisit")}</p>
                <p className="cta1">
                  {getProjectVisitStatistics?.data.get_project_visit_statistics.total ||
                    0 + " " + t("visit")}
                </p>
              </div>
              <div className="px-1 pr-[4%]">
                <LineChart
                  data={getProjectVisitStatistics?.data.get_project_visit_statistics.result.map(
                    (i) => i.visitPerDay
                  )}
                  categories={getProjectVisitStatistics?.data.get_project_visit_statistics.result.map(
                    (i) => getDate(i.date, lang)
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </main>
      <CustomModal
        title={tPM("deleteProjectMessageTitle")}
        description={tPM("deleteProjectMessageDescription")}
        openState={openDeleteProjectModal}
        cancelOnClick={() => setOpenDeleteProjectModal(false)}
        okOnClick={deleteProject}
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
