import Head from "next/head";
import dynamic from "next/dynamic";
import { useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { GET_ROOT_SUBJECTS } from "@services/gql/query/GET_ROOT_SUBJECTS";
import { GET_ALL_CATEGORIES } from "@services/gql/query/GET_ALL_CATEGORIES";
import { GET_SINGLE_PROJECT } from "@services/gql/query/GET_SINGLE_PROJECT";
//COMPONENT
import ProjectForm from "@components/common/projectForm/Main";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
// COMPONENT DYNAMIC IMPORT
const ErrorBox = dynamic(() => import("@components/common/ErrorBox"), { ssr: false });

export default function EditProjectPage({ params }) {
  const projectInfo = useQuery(GET_SINGLE_PROJECT, {
    variables: {
      id: `${params?.id}`,
    },
    fetchPolicy: "no-cache",
  });
  const allCategories = useQuery(GET_ALL_CATEGORIES);
  const rootSubjects = useQuery(GET_ROOT_SUBJECTS);
  const { t } = useTranslation();
  const { t: tPF } = useTranslation("projectForm");
  if (projectInfo.error) return <ErrorBox />;
  if (allCategories.loading || rootSubjects.loading || projectInfo.loading)
    return <LoadingScreen />;
  return (
    <>
      <Head>
        <title>{t("projectProfile")}</title>
      </Head>
      <ProjectForm
        t={t}
        tPF={tPF}
        data={projectInfo.data.getSingleProject}
        allCategories={allCategories.data?.get_all_categories}
        rootSubjects={rootSubjects.data?.get_root_subjects}
        associationId={projectInfo.data.getSingleProject.assigned_to._id}
        isProject={false}
        isEditProject={true}
        isProposal={false}
        isEditProposal={false}
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
      ...(await serverSideTranslations(locale, ["projectForm", "common"])),
      params,
    },
  });
};
