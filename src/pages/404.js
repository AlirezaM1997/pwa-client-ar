import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { getCookie } from "cookies-next";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

export default function Error404Page() {
  const lang = getCookie("NEXT_LOCALE");
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{"404"}</title>
      </Head>
      <div
        className="flex flex-col justify-center items-center h-screen bgErrorPage"
        dir={lang == "ar"  ? "rtl" : ""}
      >
        <h1 className="font-extrabold text-[130px] text-gray2">{"404"}</h1>
        <h1 className="heading">{t("errorMessages.pageNotFuond")}</h1>
        <p className="caption3 text-gray4 mt-1 mb-9">{t("errorMessages.backToHome")}</p>
        <CustomButton
          onClick={() => (window.location.href = "/")}
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
