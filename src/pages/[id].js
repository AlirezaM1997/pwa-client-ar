import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMutation } from "@apollo/client";
//GQL
import { USER_VISIT_BY_LINK } from "@services/gql/mutation/USER_VISIT_BY_LINK";
import TarighPage from "@components/pages/yaranemahdi";
import KhademinPage from "@components/pages/khademin";
import itikafPage from "@components/pages/itikaf";

const abortPages = {
  yaranemahdi: TarighPage,
  khademin: KhademinPage,
  itikaf: itikafPage,
};

export default function FakePage() {
  const router = useRouter();
  const [user_visit] = useMutation(USER_VISIT_BY_LINK);

  const visit = async () => {
    try {
      const {
        data: { user_visits_by_link },
      } = await user_visit({
        variables: { link: router.query?.id },
      });
      if (user_visits_by_link.status === 200) {
        router.push(
          "/search?source=project&sort=MOST_VISIT_COUNT&subjects=624aa190c7902a2d7c067fc6",
          undefined,
          { shallow: true }
        );
      } else {
        router.push("/", undefined, { shallow: true });
      }
    } catch (error) {
      router.push("/", undefined, { shallow: true });
    }
  };

  useEffect(() => {
    const labels = Object.keys(abortPages);
    if (!labels?.includes(router.query?.id)) visit();
  }, []);

  const AbortComponent = abortPages[router?.query?.id];
  if (AbortComponent) return <AbortComponent />;

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="font-extrabold text-heading text-gray2">
          {"در حال انتقال به صفحه موردنظر هستید ..."}
        </h1>
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
