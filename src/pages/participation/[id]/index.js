import Head from "next/head";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { ArrowLeft, ArrowRight, DirectboxNotif } from "iconsax-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//FUNCTION
import { getRequirementsName } from "@functions/getRequirementsName";
//COMPONENT
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import FinancialParticipation from "@components/pages/participation/FinancialParticipation";
// COMPONENT DYNAMIC IMPORT
const MoralParticipation = dynamic(
  () => import("@components/pages/participation/MoralParticipation"),
  { ssr: false }
);
const IdeasParticipation = dynamic(
  () => import("@components/pages/participation/IdeasParticipation"),
  { ssr: false }
);
const SkillParticipation = dynamic(
  () => import("@components/pages/participation/SkillParticipation"),
  { ssr: false }
);
const CapacityParticipation = dynamic(
  () => import("@components/pages/participation/CapacityParticipation"),
  {
    ssr: false,
  }
);
const PressenceParticipation = dynamic(
  () => import("@components/pages/participation/PressenceParticipation"),
  { ssr: false }
);
// Variables
const requirements = [
  { name: "FINANCIAL" },
  { name: "MORAL" },
  { name: "IDEAS" },
  { name: "CAPACITY" },
  { name: "PRESSENCE" },
  { name: "SKILL" },
];

const ParticipationTabs = {
  2: MoralParticipation,
  3: IdeasParticipation,
  4: CapacityParticipation,
  5: PressenceParticipation,
  6: SkillParticipation,
};

export default function ParticipationPage({ params }) {
  const { t } = useTranslation();
  const { t: tPA } = useTranslation("participation");
  const lang = getCookie("NEXT_LOCALE");
  const [redirectLoading, setRedirectLoading] = useState(false);
  const router = useRouter();
  const projectId = params.id;
  const currentTab = router.query.tab;
  const renderParticipationTab = (TabComponent) => (
    <TabComponent t={t} tPA={tPA} projectId={projectId} lang={lang} showDescription={false} />
  );

  if (redirectLoading) return <LoadingScreen />;
  return (
    <>
      <Head>
        <title>{tPA("page-title")}</title>
      </Head>
      <section className="2xl:w-[1320px] 2xl:mx-auto ">
        <div className="flex justify-between px-4 pt-5 lg:justify-end">
          <div
            onClick={() => {
              toast.remove();
              router.back();
            }}
            className="bg-[#03A7CC14] rounded-full w-8 h-8 flex items-center justify-center lg:hidden"
          >
            {lang === "en" ? (
              <ArrowLeft fill="#03A6CF" color="#03A6CF" />
            ) : (
              <ArrowRight fill="#03A6CF" color="#03A6CF" />
            )}
          </div>
          <p className="lg:hidden">{tPA("tTopBar")}</p>
          <div
            className="bg-[#03A7CC14] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={() => {
              toast.remove();
              router.push(`/my-participation/${projectId}`, undefined, { shallow: true });
            }}
          >
            <DirectboxNotif fill="#03A6CF" color="#03A6CF" />
          </div>
        </div>
        <header className="px-4 mt-[30px] w-full">
          <div className="border-b-[1px] lg:border-b-[3px] border-gray6 relative py-[8px] lg:py-[16px] px-1 flex justify-between gap-x-6 chipsFilter">
            {requirements.map((i, j) => (
              <button
                key={j}
                className={`text-[11px] leading-[20px] font-semibold lg:text-[18px] relative ${
                  router.query.tab == j + 1
                    ? "text-main2 before:content-[''] before:absolute before:h-[3px] before:lg:h-[6px] before:w-full before:left-1/2 before:-translate-x-1/2 before:top-[130%] before:lg:top-[160%] before:bg-main2  before:rounded-t-[1.5px] before:lg:rounded-t-[4px] before:z-10"
                    : "text-gray1"
                } `}
                onClick={() => {
                  router.replace(`/participation/${projectId}?tab=${j + 1}`);
                  toast.remove();
                }}
              >
                {getRequirementsName(i.name, lang)}
              </button>
            ))}
          </div>
        </header>
        <main className="flex flex-col justify-center items-center w-full">
          {router.query.tab == 1 && (
            <FinancialParticipation
              t={t}
              tPA={tPA}
              projectId={projectId}
              lang={lang}
              showDescription={false}
              setRedirectLoading={setRedirectLoading}
            />
          )}
          {currentTab &&
            ParticipationTabs[currentTab] &&
            renderParticipationTab(ParticipationTabs[currentTab])}
        </main>
      </section>
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
      ...(await serverSideTranslations(locale, ["participation", "common"])),
      params,
    },
  };
};
