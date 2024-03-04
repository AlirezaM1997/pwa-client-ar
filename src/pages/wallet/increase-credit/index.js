import Head from "next/head";
import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//CONSTANT
import { exceptThisSymbols } from "@constants/index";
//FUNCTION
import numberToEnglish from "@functions/numberToEnglish";
import numToArabic from "@functions/numToArabic";
//GQL
import { CHARGE_BALANCE } from "@services/gql/mutation/CHARGE_BALANCE";
//COMPONENT
import Header from "@components/common/Header";
import CustomButton from "@components/kit/button/CustomButton";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });

export default function IncreaseCreditPage() {
  const { t } = useTranslation();
  const { t: tW } = useTranslation("wallet");
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();
  const [amount, setAmount] = useState(null);
  const [less10Error, setless10Error] = useState(false);
  const [over100MError, setOver100MError] = useState(false);
  const [redirectLoading, setRedirectLoading] = useState(false);

  const [charge_balance] = useMutation(CHARGE_BALANCE);
  const increaseCreditFunc = async () => {
    const variables = {
      amount: Number(amount),
      redirectTo: `${process.env.NEXT_PUBLIC_PUBLISH_DOMAIN}/${lang}/wallet`,
      src: "pwa",
    };
    if (amount < 10000) {
      setless10Error(true);
    } else if (amount > 100000000) {
      setOver100MError(true);
    } else {
      setRedirectLoading(true);
      setless10Error(false);
      setOver100MError(false);
      try {
        const { data } = await charge_balance({
          variables,
        });
        if (data) {
          router.push(data.charge_balance, undefined, { shallow: true });
        }
      } catch (error) {
        setRedirectLoading(false);
        toast.custom(() => <Toast text={error?.message} status="ERROR" />);
      }
    }
  };

  if (redirectLoading) return <LoadingScreen />;
  return (
    <>
      <Head>
        <title>{tW("increaseCredit")}</title>
      </Head>
      <section>
        <Header onClick={() => history.back()} title={tW("increaseCredit")} />
        <div className="px-4 pt-[30px]">
          <h1 className="heading">{tW("increaseCredit")}</h1>
          <p className="caption1 pt-[2px] pb-[22px]">{tW("increaseCreditDes")}</p>
          <div className="pb-5">
            <div className="relative">
              <input
                className="rounded-lg border-[1px] border-gray2 w-full py-[9px] rtl:pl-11 rtl:pr-2 ltr:pr-11 ltr:pl-2 ltr:placeholder:text-left rtl:placeholder:text-right placeholder:text-gray2 placeholder:text-[12px] outline-none"
                type="number"
                value={amount}
                dir="ltr"
                onChange={(e) => setAmount(e.target.value.replace(/^0/, ""))}
                onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()}
              />
              <span className="caption3 absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2">
                {t("toman")}
              </span>
            </div>
            {amount ? (
              <div className="flex items-center justify-center mt-3">
                <p className="pl-1 ltr:pr-1 text-[10px] leading-[20px] font-normal text-gray4">
                  {lang === "en" ? numberToEnglish(amount) : numToArabic(amount)}
                </p>
                <p className="text-[10px] leading-[20px] font-normal text-gray4">{t("toman")}</p>
              </div>
            ) : null}
            {less10Error ? (
              <div className="flex items-center justify-center mt-3">
                <p className="pl-1 ltr:pr-1 text-[10px] leading-[20px] font-normal text-danger">
                  {"حداقل مبلغ برای شارژ 10 هزار تومان است"}
                </p>
              </div>
            ) : null}
            {over100MError ? (
              <div className="flex items-center justify-center mt-3">
                <p className="pl-1 ltr:pr-1 text-[10px] leading-[20px] font-normal text-danger">
                  {"حداکثر مبلغ برای شارژ 100 میلیون تومان است"}
                </p>
              </div>
            ) : null}
          </div>
          <CustomButton
            onClick={() => increaseCreditFunc()}
            title={tW("increaseCredit")}
            isFullWidth={true}
            size="S"
            isDisabled={amount < 99}
            isPointerEventsNone={amount < 99}
          />
        </div>
      </section>
    </>
  );
}
export async function getStaticProps({ locale }) {
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["common", "wallet"])),
    },
  });
}
