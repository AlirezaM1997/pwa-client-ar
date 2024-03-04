import Head from "next/head";
import { useTranslation } from "next-i18next";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Danger } from "iconsax-react";
import PlainInput from "@components/kit/Input/PlainInput";
import CustomButton from "@components/kit/button/CustomButton";
import { useState } from "react";
import toast from "react-hot-toast";
import Toast from "@components/kit/toast/Main";

export default function DeleteAccountPage() {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleDeleteAccount = () => {
    toast.custom(() => <Toast text={t("successfulRequestToast")} />);
    setTimeout(() => {
      window.open("https://hnaya.ir", "_blank", "noopener,noreferrer");
      toast.remove();
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>{t("deleteAccount")}</title>
      </Head>
      <section className="flex flex-col items-center justify-center h-screen">
        <Danger color="#CB3A31" size={140} />
        <h1 className="heading mt-9 mb-5">{t("deleteAccount")}</h1>
        <p className="cta3 mb-9">{t("deleteAccountDes")}</p>
        <PlainInput
          value={phoneNumber}
          setValue={setPhoneNumber}
          maxLength={25}
          hasMarginBottom={true}
          labelText={t("login.phoneNumber")}
          pattern="\d*"
          inputMode="numeric"
          inputDir="ltr"
        />
        <CustomButton
          onClick={handleDeleteAccount}
          title={t("deleteAccount")}
          size="S"
          paddingX="px-6"
          isDisabled={!phoneNumber}
        />
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
