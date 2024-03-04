import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useWindowSize } from "@uidotdev/usehooks";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//COMPONENT
import SingeleConversation from "@components/pages/messages/chats/SingeleConversation";

export default function SingleMessage() {
  const { t } = useTranslation();
  const size = useWindowSize();
  const router = useRouter();

  if (size.width > 960) router.push("/messages", undefined, { shallow: true });
  return (
    <>
      <Head>
        <title>{t("chat")}</title>
      </Head>
      <SingeleConversation t={t} />
    </>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
