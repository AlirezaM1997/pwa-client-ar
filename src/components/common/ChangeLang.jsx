import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { useWindowSize } from "@uidotdev/usehooks";
import { getCookie, setCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { accountsAction } from "@store/slices/accounts";
import { I24Support, LanguageSquare } from "iconsax-react";
// GQL
import { USER_SELECT_LANGUAGE } from "@services/gql/mutation/USER_SELECT_LANGUAGE";
//COMPONENT
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import Loading from "@components/kit/loading/Loading";

export default function ChangeLang({ classNames = "" }) {
  ///////////////////////HOOKS///////////////////////
  const { t } = useTranslation();
  const router = useRouter();
  const isMobile = useWindowSize().width < 960;
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.accounts);
  const token = useSelector((state) => state.token);
  const [loading, setLoading] = useState(false);
  const size = useWindowSize();
  const largeSize = size.width > 960;
  ///////////////////////CONSTANTS///////////////////////
  const languages = [
    { title: t("languages.arabic"), subTitle: "Arabic", lang: "ar" },
    { title: t("languages.english"), subTitle: "English", lang: "en" },
  ];

  ///////////////////////FUNCTIONS///////////////////////
  const [changeLang] = useMutation(USER_SELECT_LANGUAGE);
  const changeLanguage = async (lang) => {
    setLoading(true);
    if (token._id) {
      const {
        data: { user_select_language },
      } = await changeLang({
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
          document.location.replace(`/${lang}${router.asPath}`);
        }, 300);
      }
    } else {
      setCookie("NEXT_LOCALE", lang);
      setTimeout(() => {
        document.location.replace(`/${lang}${router.asPath}`);
      }, 300);
    }
  };

  if (loading) return isMobile ? <LoadingScreen /> : <Loading />;
  return (
    <div className={classNames}>
      <div className="bg-gray6 px-4 gap-[6px] py-[5px] mb-5 flex items-center">
        <LanguageSquare size={16} color="#2E2E2E" />
        <h3 className="titleInput leading-[26px] text-black">{t("language")}</h3>
      </div>
      <div className="px-4">
        {languages.map((item, _index) => {
          return (
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
          );
        })}
      </div>
      {!largeSize && (
        <>
          <div className="bg-gray6 px-4 gap-[6px] py-[5px] mb-5 flex items-center">
            <I24Support size={16} color="#2E2E2E" />
            <h3 className="titleInput leading-[26px] text-black">{t("support")}</h3>
          </div>
          <div className="mt-1 px-4">
            <div
              onClick={() =>
                (window.location.href =
                  "https://widget.raychat.io/654f1eabc8a6649d9137a710?version=2")
              }
            >
              {t("onlinechat")}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
