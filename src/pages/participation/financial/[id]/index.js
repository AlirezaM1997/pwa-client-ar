import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { getCookie } from "cookies-next";
import { useTranslation } from "next-i18next";
import { ArrowLeft, ArrowRight, DirectboxNotif } from "iconsax-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//COMPONENT
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import FinancialParticipation from "@components/pages/participation/FinancialParticipation";

export default function FinancialParticipationPage({ params }) {
  const { t } = useTranslation();
  const { t: tPA } = useTranslation("participation");
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();
  const projectId = params.id;
  const [redirectLoading, setRedirectLoading] = useState(false);

  if (redirectLoading) return <LoadingScreen />;
  return (
    <>
      <Head>
        <title>{tPA("financialP")}</title>
      </Head>
      <div className="flex justify-between px-4 pt-7 lg:hidden">
        <div
          onClick={() => {
            toast.remove();
            router.back();
          }}
          className="bg-[#03A7CC14] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
        >
          {lang === "en" ? (
            <ArrowLeft fill="#03A6CF" color="#03A6CF" />
          ) : (
            <ArrowRight fill="#03A6CF" color="#03A6CF" />
          )}
        </div>
        <div
          className="bg-[#03A7CC14] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
          onClick={() => {
            toast.remove();
            router.push(`/my-participation/financial/${projectId}`, undefined, { shallow: true });
          }}
        >
          <DirectboxNotif fill="#03A6CF" color="#03A6CF" />
        </div>
      </div>
      <div className="hidden lg:inline-block mx-8 mt-6">
        <div
          className="bg-[#03A7CC14] rounded-full w-10 h-10 hidden lg:flex  items-center justify-center  cursor-pointer"
          onClick={() => {
            toast.remove();
            router.push(`/my-participation/financial/${projectId}`, undefined, { shallow: true });
          }}
        >
          <DirectboxNotif fill="#03A6CF" color="#03A6CF" />
        </div>
      </div>
      <FinancialParticipation
        t={t}
        tPA={tPA}
        projectId={params.id}
        lang={lang}
        setRedirectLoading={setRedirectLoading}
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
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "participation"])),
      params,
    },
  };
};
