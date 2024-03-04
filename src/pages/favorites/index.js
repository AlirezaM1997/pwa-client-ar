import Head from "next/head";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//COMPONENT
import Favorites from "@components/pages/favorites/Main";

export default function FavoritesPage() {
  const { t } = useTranslation();
  const { t: tHome } = useTranslation("home");
  const isUser = useSelector((state) => state.isUser.isUser);

  return (
    <>
      <Head>
        <title>{t("favorites.page-title")}</title>
      </Head>
      <Favorites t={t} tHome={tHome} isUser={isUser} />
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["home", "common"])),
    },
  };
}
