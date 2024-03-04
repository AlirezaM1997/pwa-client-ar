import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

export default function Error500Page() {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("errorMessages.serverErrorPageTitle")}</title>
      </Head>
      <div className="flex flex-col justify-center items-center h-screen bgErrorPage">
        <h1 className="font-extrabold text-[130px] text-gray2">{"500"}</h1>
        <h1 className="heading">{t("errorMessages.serverError")}</h1>
        <p className="caption3 text-gray4 mt-1">{t("errorMessages.tryAgainMessage")}</p>
        <CustomButton onClick={() => history.back()} title={t("tryAgain")} width="w-[170px]" />
      </div>
    </>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
