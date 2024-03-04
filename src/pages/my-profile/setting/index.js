import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { LanguageSquare } from "iconsax-react";
import { getCookie, setCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { accountsAction } from "@store/slices/accounts";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { USER_SELECT_LANGUAGE } from "@services/gql/mutation/USER_SELECT_LANGUAGE";
//COMPONENT
import Header from "@components/common/Header";
import MyProfilePageSettingSkeleton from "@components/common/skeleton/MyProfilePageSettingSkeleton";

export default function MyProfilePage() {
  ///////////////////////HOOKS///////////////////////
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.accounts);
  const token = useSelector((state) => state.token);
  const [loading, setLoading] = useState(false);

  ///////////////////////CONSTANTS///////////////////////
  const languages = [
    { title: t("languages.arabic"), subTitle: "Arabic", lang: "ar" },
    { title: t("languages.english"), subTitle: "English", lang: "en" },
  ];

  ///////////////////////FUNCTIONS///////////////////////
  const [follow] = useMutation(USER_SELECT_LANGUAGE);
  const changeLanguage = async (lang) => {
    setLoading(true);
    const {
      data: { user_select_language },
    } = await follow({
      variables: {
        lang: String(lang).toUpperCase(),
      },
    });
    if (user_select_language.status === 200) {
      setCookie("NEXT_LOCALE", lang);
      dispatch(
        accountsAction({
          accounts: accounts.map((item) => (item._id !== token._id ? item : { ...item, lang })),
        })
      );
      setTimeout(() => {
        document.location.replace(`/${lang}/my-profile/setting`);
      }, 300);
    }
  };

  const handleBackClick = () => {
    router.push(router.pathname.slice(0, router.pathname.lastIndexOf("/")), undefined, {
      locale: getCookie("NEXT_LOCALE"),
      shallow: true,
    });
  };

  if (loading) return <MyProfilePageSettingSkeleton />;
  return (
    <>
      <Head>
        <title>{t("setting")}</title>
      </Head>
      <section>
        <Header onClick={handleBackClick} title={t("setting")} />
        <main className="max-w-[1320px] 2xl:mx-auto">
          <div className="bg-gray6 px-4 py-[5px] gap-[6px] mb-5 flex items-center">
            <LanguageSquare size={16} color="#2E2E2E" />
            <h3 className="titleInput leading-[26px] text-black">{t("language")}</h3>
          </div>
          <div className="px-4">
            {languages.map((item, _index) => (
              <div
                key={_index}
                className={`${
                  item.lang === getCookie("NEXT_LOCALE") && "pointer-events-none"
                } inputTypeRadio flex items-center ltr:justify-start mb-5`}
              >
                <input
                  type="radio"
                  name="list"
                  value={item.lang}
                  id={item.lang}
                  checked={item.lang === getCookie("NEXT_LOCALE")}
                  onChange={() => changeLanguage(item.lang)}
                  className="ltr:mr-3 rtl:ml-3 !w-[20px] !h-[20px]"
                />
                <label htmlFor={item.lang} className="flex items-center justify-between w-full">
                  <p className="caption1 leading-[24px] text-gray1">{item.title}</p>
                  {getCookie("NEXT_LOCALE") !== "en" && (
                    <p className="caption3 text-gray4">{item.subTitle}</p>
                  )}
                </label>
              </div>
            ))}
          </div>
        </main>
      </section>
    </>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["profile", "common"])),
    },
  };
}
