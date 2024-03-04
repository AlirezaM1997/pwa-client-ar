import Head from "next/head";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { ArrowLeft, ArrowRight } from "iconsax-react";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//COMPONENT
import SearchInput from "@components/kit/Input/SearchInput";
import HqList from "@components/pages/setad-hq-list/HqList";
import CustomButton from "@components/kit/button/CustomButton";
import SetadList from "@components/pages/setad-hq-list/SetadList";

export default function SetadHqListPage() {
  const { t } = useTranslation();
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(null);

  useEffect(() => {
    setTab(router.query?.source === "hq" ? "hq" : "setad");
  }, [router.query]);

  return (
    <>
      <Head>
        <title>{t("setadHqList")}</title>
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
          buttonOnClick={() => history.back()}
          value={search}
          setValue={setSearch}
          isIconLeft={true}
        />

        <div className="chipsFilter flex w-full z-[1001] mt-3">
          <div className="mx-1">
            <CustomButton
              title={t("setad")}
              siza={"XS"}
              styleType={tab === "setad" ? "Primary" : "Secondary"}
              bgColor={tab === "setad" ? "bg-[#03A6CF]" : "bg-white"}
              textColor={tab === "setad" ? "text-white" : "text-gray4"}
              borderColor={tab === "setad" ? "border-main2" : "border-gray4"}
              paddingX={"px-[14px]"}
              onClick={() =>
                router.push(`/setad-hq-list?source=setad`, undefined, { shallow: true })
              }
            />
          </div>

          <div className="mx-1">
            <CustomButton
              title={t("hq")}
              siza={"XS"}
              styleType={tab === "hq" ? "Primary" : "Secondary"}
              bgColor={tab === "hq" ? "bg-[#03A6CF]" : "bg-white"}
              textColor={tab === "hq" ? "text-white" : "text-gray4"}
              borderColor={tab === "hq" ? "border-main2" : "border-gray4"}
              paddingX={"px-[14px]"}
              onClick={() => router.push(`/setad-hq-list?source=hq`, undefined, { shallow: true })}
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-center">
          {tab === "setad" ? <SetadList /> : null}

          {tab === "hq" ? <HqList /> : null}
        </div>
      </section>
    </>
  );
}
export async function getStaticProps({ locale }) {
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  });
}
