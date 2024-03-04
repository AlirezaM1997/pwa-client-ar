import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { ASSOCIATION_ME } from "@services/gql/query/ASSOCIATION_ME";
import { GET_ROOT_SUBJECTS } from "@services/gql/query/GET_ROOT_SUBJECTS";
import { GET_ALL_CATEGORIES } from "@services/gql/query/GET_ALL_CATEGORIES";
import { GET_SINGLE_PROJECT } from "@services/gql/query/GET_SINGLE_PROJECT";
import { GET_SINGLE_PROJECT_REQUEST } from "@services/gql/query/GET_SINGLE_PROJECT_REQUEST";
import { GET_SINGLE_PROJECT_IN_PROJECT_MANAGEMENT } from "@services/gql/query/GET_SINGLE_PROJECT_IN_PROJECT_MANAGEMENT";
//COMPONENT
import ProjectForm from "@components/common/projectForm/Main";
import RequestForm from "@components/common/requestForm/Main";
import LoadingScreen from "@components/kit/loading/LoadingScreen";

export default function EditFormPage() {
  const { t: tPF } = useTranslation("projectForm");
  const { t } = useTranslation();
  const router = useRouter();
  const instanceId = router?.query?.id;

  const [confirmLoading, setConfirmLoading] = useState(false);

  const allCategories = useQuery(GET_ALL_CATEGORIES);
  const rootSubjects = useQuery(GET_ROOT_SUBJECTS);
  const association = useQuery(ASSOCIATION_ME, { fetchPolicy: "no-cache" });

  const getSingleProject = useQuery(GET_SINGLE_PROJECT_IN_PROJECT_MANAGEMENT, {
    variables: {
      id: instanceId,
    },
    fetchPolicy: "no-cache",
  });
  const projectStatus = getSingleProject.data?.getSingleProject?.projectStatus?.status;
  const instance = association.data
    ? useQuery(GET_SINGLE_PROJECT, {
        variables: {
          id: `${instanceId}`,
        },
        fetchPolicy: "no-cache",
      })
    : useQuery(GET_SINGLE_PROJECT_REQUEST, {
        variables: {
          id: `${instanceId}`,
        },
        fetchPolicy: "no-cache",
      });

  if (
    allCategories.loading ||
    rootSubjects.loading ||
    association.loading ||
    confirmLoading ||
    instance.loading
  )
    return <LoadingScreen />;
  return (
    <>
      <Head>
        <title>{!association.data ? tPF("createRequest") : tPF("createPtoject")}</title>
      </Head>
      {instance.data &&
        (!association.data ? (
          <RequestForm
            t={t}
            tPF={tPF}
            allCategories={allCategories.data.get_all_categories}
            rootSubjects={rootSubjects.data.get_root_subjects}
            requestId={instanceId}
            data={instance.data.getSingleProjectRequest}
            setConfirmLoading={setConfirmLoading}
            projectStatus={projectStatus}
          />
        ) : (
          <ProjectForm
            t={t}
            tPF={tPF}
            allCategories={allCategories.data.get_all_categories}
            rootSubjects={rootSubjects.data.get_root_subjects}
            associationId={association.data.association_me._id}
            data={instance.data.getSingleProject}
            isProject={true}
            isEditProject={true}
            isProposal={false}
            isEditProposal={false}
            setConfirmLoading={setConfirmLoading}
            projectStatus={projectStatus}
          />
        ))}
    </>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps({ params, locale }) {
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["projectForm", "common"])),
    },
  });
}
