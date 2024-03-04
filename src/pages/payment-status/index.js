import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import Image from "next/legacy/image";
import { getCookie } from "cookies-next";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { getJsonFromUrl } from "@functions/getJsonFromUrl";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// GQL
import { VALIDATE_ZARINPAL_PAYMENT } from "@services/gql/mutation/VALIDATE_ZARINPAL_PAYMENT";
import { VALIDATE_ZARINPAL_LOGGED_IN_PAYMENT } from "@services/gql/mutation/VALIDATE_ZARINPAL_LOGGED_IN_PAYMENT";

export default function AfterPaymentPage() {
  const lang = getCookie("NEXT_LOCALE");
  const token = useSelector((state) => state.token);
  const { src, redirectTo, Status, Authority } = getJsonFromUrl();
  const openInNewTab = src == "pwa" ? false : true;
  const successfullyTranslate = lang == "ar" ? "موفقیت آمیز" : "Successfully";
  const failedTranslate = lang == "ar" ? "ناموفق" : "Failed";
  const successPayMessageTranslate =
    lang == "ar" ? "پرداخت شما با موفقیت ثبت شد" : "Your payment has been successfully registered";
  const failedPayMessageTranslate =
    lang == "ar" ? "پرداخت شما ناموفق بود" : "Your payment has been unsuccessfully registered";
  const title_ = Status === "OK" ? successfullyTranslate : failedTranslate;
  const subTitle = Status === "OK" ? successPayMessageTranslate : failedPayMessageTranslate;

  const [validateZarinpalLoggedInPayment] = useMutation(VALIDATE_ZARINPAL_LOGGED_IN_PAYMENT);
  const [validateZarinpalPayment] = useMutation(VALIDATE_ZARINPAL_PAYMENT);

  const callbackFunc = () => {
    const variables = {
      authority: Authority,
      status: Status,
    };
    if (token._id) {
      validateZarinpalLoggedInPayment({ variables });
    } else validateZarinpalPayment({ variables });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      callbackFunc();
    }, 100);

    return () => clearTimeout(timeout);
  }, [token]);

  return (
    <>
      <Head>
        <title>{lang == "ar" ? "وضعیت تراکنش" : "Transaction status"}</title>
      </Head>
      <div className="flex flex-col items-center mt-[162px] text-center">
        <div className="relative w-[100px] h-[100px] mb-[29px]">
          <Image
            src={
              Status === "OK" ? "/assets/images/success-mark.png" : "/assets/images/fail-mark.png"
            }
            layout="fill"
            alt="Successfully"
            className="rounded-full cover-center-img"
          />
        </div>
        <h3 className="text-black titleDesktop1 tracking-normal mb-[3px]">{title_}</h3>
        <p className="text-gray2 titleInput tracking-normal mb-[33px]">{subTitle}</p>
        <Link
          href={`${redirectTo}?isOk=${Status === "OK" ? 1 : 0}`}
          target={openInNewTab ? "_blank" : "_self"}
          // rel={openInNewTab ? "noopener,noreferrer" : ""}
          replace
          prefetch={false}
          className="bg-black text-white cta3 leading-4 p-[16px_119px] rounded-lg"
        >
          {lang == "ar" ? "بازگشت به اپلیکیشن" : "Open The App"}
        </Link>
      </div>
    </>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "wallet"])),
    },
  };
}
