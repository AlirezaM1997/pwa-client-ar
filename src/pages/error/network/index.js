import Head from "next/head";
import { getCookie } from "cookies-next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

export default function NetworkErrorPage() {
  const { t } = useTranslation();
  const lang = getCookie("NEXT_LOCALE");
  return (
    <>
      <Head>
        <title>{t("errorMessages.serverErrorPageTitle")}</title>
      </Head>
      <div
        className="flex flex-col justify-center items-center h-screen bgErrorPage"
        dir={lang == "ar" ? "rtl" : ""}
      >
        <h1 className="font-extrabold text-[40px] text-gray2">{t("errorMessages.netWorkError")}</h1>
        <h1 className="heading">{t("errorMessages.netWorkDisconnected")}</h1>
        <p className="caption3 text-gray4 mt-1 mb-5">{t("errorMessages.tryAgainMessage")}</p>
        <CustomButton
          onClick={() => history.back()}
          title={t("tryAgain")}
          width="w-[170px]"
          size="M"
        />
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
