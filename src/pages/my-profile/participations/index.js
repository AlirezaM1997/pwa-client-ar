import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "iconsax-react";
//COMPONENT
import SearchInput from "@components/kit/Input/SearchInput";
import Receipts from "@components/pages/my-profile/Receipts";
import CustomButton from "@components/kit/button/CustomButton";
import Participations from "@components/pages/my-profile/Participations";

export default function ParticipationsPage() {
  const { t } = useTranslation();
  const { t: tPA } = useTranslation("participation");

  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(null);

  useEffect(() => {
    setTab(router.query?.source);
  }, [router.query]);

  return (
    <>
      <Head>
        <title>{t("myParticipations")}</title>
      </Head>
      <section className="px-4 pt-6 pb-[100px] max-w-[1320px] 2xl:mx-auto">
        <SearchInput
          icon={
            lang === "en" ? (
              <ArrowLeft color="#7B808C" size={16} />
            ) : (
              <ArrowRight color="#7B808C" size={16} />
            )
          }
          buttonOnClick={() => router.push("/my-profile")}
          value={search}
          setValue={setSearch}
          isIconLeft={true}
        />

        <div className="chipsFilter flex w-full z-[1001] mt-3">
          <div className="mx-1">
            <CustomButton
              title={t("receipts")}
              siza={"XS"}
              styleType={tab === "receipt" ? "Primary" : "Secondary"}
              bgColor={tab === "receipt" ? "bg-[#03A6CF]" : "bg-white"}
              textColor={tab === "receipt" ? "text-white" : "text-gray4"}
              borderColor={tab === "receipt" ? "border-main2" : "border-gray4"}
              paddingX={"px-[14px]"}
              onClick={() => router.replace(`/my-profile/participations?source=receipt`)}
            />
          </div>

          <div className="mx-1">
            <CustomButton
              title={t("projects")}
              siza={"XS"}
              styleType={tab === "project" ? "Primary" : "Secondary"}
              bgColor={tab === "project" ? "bg-[#03A6CF]" : "bg-white"}
              textColor={tab === "project" ? "text-white" : "text-gray4"}
              borderColor={tab === "project" ? "border-main2" : "border-gray4"}
              paddingX={"px-[14px]"}
              onClick={() => router.replace(`/my-profile/participations?source=project`)}
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-center pt-[20px] lg:pt-0">
          {tab === "project" ? <Participations /> : null}

          {tab === "receipt" ? <Receipts tPA={tPA} t={t} /> : null}
        </div>
      </section>
    </>
  );
}
export async function getStaticProps({ locale }) {
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["common", "participation"])),
    },
  });
}
