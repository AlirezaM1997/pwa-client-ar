import Head from "next/head";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { ASSOCIATION_ME } from "@services/gql/query/ASSOCIATION_ME";
import { GET_ROOT_SUBJECTS } from "@services/gql/query/GET_ROOT_SUBJECTS";
import { GET_ALL_CATEGORIES } from "@services/gql/query/GET_ALL_CATEGORIES";
//COMPONENT
import ProjectForm from "@components/common/projectForm/Main";
import RequestForm from "@components/common/requestForm/Main";
import CreateFormSkeleton from "@components/common/skeleton/CreateFormSkeleton";

export default function CreateFormPage() {
  const { t: tPF } = useTranslation("projectForm");
  const { t } = useTranslation();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const currentUserId = useSelector((state) => state.token._id);
  const allCategories = useQuery(GET_ALL_CATEGORIES);
  const rootSubjects = useQuery(GET_ROOT_SUBJECTS);
  const association = useQuery(ASSOCIATION_ME, { fetchPolicy: "no-cache" });
  if (
    !allCategories?.data ||
    allCategories.loading ||
    !rootSubjects?.data ||
    rootSubjects.loading ||
    association.loading ||
    confirmLoading
  )
    return <CreateFormSkeleton />;
  return (
    <>
      <Head>
        <title>{!association.data ? tPF("createRequest") : tPF("createPtoject")}</title>
      </Head>
      {!association.data ? (
        <RequestForm
          t={t}
          tPF={tPF}
          allCategories={allCategories.data.get_all_categories}
          rootSubjects={rootSubjects.data.get_root_subjects}
          userId={currentUserId}
          setConfirmLoading={setConfirmLoading}
        />
      ) : (
        <ProjectForm
          t={t}
          tPF={tPF}
          allCategories={allCategories.data.get_all_categories}
          rootSubjects={rootSubjects.data.get_root_subjects}
          associationId={association.data.association_me._id}
          isProject={true}
          isEditProject={false}
          isProposal={false}
          isEditProposal={false}
          setConfirmLoading={setConfirmLoading}
        />
      )}
    </>
  );
}
export async function getStaticProps({ locale }) {
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["projectForm", "common"])),
    },
  });
}
