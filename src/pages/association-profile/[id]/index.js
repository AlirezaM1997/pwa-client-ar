import Head from "next/head";
import { getCookie } from "cookies-next";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { GET_PROJECTS } from "@services/gql/query/GET_PROJECTS";
import { GET_ASSOCIATION_BYID } from "@services/gql/query/GET_ASSOCIATION_BYID";
//COMPONENT
import AssociationProfile from "@components/pages/association-profile/Main";
import AssociationProfileSkeleton from "@components/common/skeleton/AssociationProfileSkeleton";

export default function AssociationProfilePage({ params }) {
  const lang = getCookie("NEXT_LOCALE");
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);

  const {
    loading: loadingAssociation,
    error: errorAssociation,
    data,
    refetch,
  } = useQuery(GET_ASSOCIATION_BYID, {
    variables: {
      id: params?.id,
    },
    fetchPolicy: "no-cache",
  });

  const [getProjects, { loading, error, data: projectData }] = useLazyQuery(GET_PROJECTS, {
    variables: {
      page: 0,
      limit: 10,
      filters: {
        associationId: params?.id,
      },
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (!projectData) getProjects();
    if (projectData) {
      setProjects(projectData?.get_projects.result);
    }
  }, [projectData]);

  if (error || errorAssociation) return <h5>{error?.message || errorAssociation?.message}</h5>;
  if (loading || loadingAssociation) return <AssociationProfileSkeleton />;
  return (
    <>
      <Head>
        <title>{data?.get_association_byId.name}</title>
      </Head>
      <AssociationProfile
        t={t}
        lang={lang}
        data={data?.get_association_byId}
        refetch={refetch}
        projects={projects}
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
