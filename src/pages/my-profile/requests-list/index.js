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
import CustomButton from "@components/kit/button/CustomButton";
import LicenseRequests from "@components/pages/my-profile/LicenseRequests";
import BelongingRequests from "@components/pages/my-profile/BelongingRequest";

export default function RequestsListPage() {
  const { t } = useTranslation();
  const { t: tP } = useTranslation("profile");

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
        <title>{tP("licenseAndBelongingList")}</title>
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
              title={t("licenseRequest")}
              siza={"XS"}
              styleType={tab === "license" ? "Primary" : "Secondary"}
              bgColor={tab === "license" ? "bg-[#03A6CF]" : "bg-white"}
              textColor={tab === "license" ? "text-white" : "text-gray4"}
              borderColor={tab === "license" ? "border-main2" : "border-gray4"}
              paddingX={"px-[14px]"}
              onClick={() => router.replace(`/my-profile/requests-list?source=license`)}
            />
          </div>

          <div className="mx-1">
            <CustomButton
              title={t("requestToBelong")}
              siza={"XS"}
              styleType={tab === "belonging" ? "Primary" : "Secondary"}
              bgColor={tab === "belonging" ? "bg-[#03A6CF]" : "bg-white"}
              textColor={tab === "belonging" ? "text-white" : "text-gray4"}
              borderColor={tab === "belonging" ? "border-main2" : "border-gray4"}
              paddingX={"px-[14px]"}
              onClick={() => router.replace(`/my-profile/requests-list?source=belonging`)}
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-center pt-[10px] lg:pt-0">
          {tab === "belonging" ? <BelongingRequests t={t} /> : null}
          {tab === "license" ? <LicenseRequests t={t} /> : null}
        </div>
      </section>
    </>
  );
}
export async function getStaticProps({ locale }) {
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["common", "profile"])),
    },
  });
}
