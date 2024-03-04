/* eslint-disable react/no-unknown-property */
import ChangeLang from "@components/common/ChangeLang";
import Header from "@components/common/Header";
import GlobalSearchModal from "@components/common/globalSearchModal/Main";
import useClickOutside from "@hooks/useClickOutside";
import { getCookie } from "cookies-next";
import { HambergerMenu } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { ASSOCIATION_ME } from "@services/gql/query/ASSOCIATION_ME";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import { useEffect } from "react";
const Login = dynamic(() => import("@components/common/login/Main"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });

export default function ItikafPage() {
  const { t } = useTranslation();
  const { t: tHome } = useTranslation("home");
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [showSearchView, setShowSearchView] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [openBergerMenu, setOpenBergerMenu] = useState(false);
  const handleConfirm = () => {
    setConfirm(true);
  };
  const elementRefs = useClickOutside([() => setShowLangModal(false)]);
  const { data, loading, error } = useQuery(ASSOCIATION_ME, { fetchPolicy: "no-cache" });

  useEffect(() => {
    if (!loading && (!data || error)) {
      setShowLogin(true);
    }
  }, [data, loading, error]);

  if (loading) return <LoadingScreen />;
  return (
    <>
      <div className="flex flex-col w-full">
        <header className="hidden px-4 lg:px-[30px] pt-2 lg:pt-4 sticky lg:flex items-center justify-between mb-4">
          <Link href={"/"} className="flex items-center gap-2" prefetch={false}>
            <div className="relative w-[86px] h-[37px]">
              <Image
                alt="logo"
                src={lang == "ar" ? "/assets/images/itikaf.png" : "/assets/images/itikaf.png"}
                layout="fill"
              />
            </div>
            <span className="text-default">ستاد مردمی اجتماعات مهدوی</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-x-2">
            <div className="relative px-4" ref={elementRefs[0]}>
              <HambergerMenu
                size={24}
                color="#292D32"
                onClick={() => setShowLangModal(!showLangModal)}
                className="cursor-pointer"
              />
              {showLangModal && (
                <div className="absolute top-[40px] rtl:-right-5 ltr:-left-5 h-[199px] w-[220px] bg-white border rounded-[10px] border-gray-5">
                  <ChangeLang classNames="pt-[25px]" />
                </div>
              )}
            </div>
            <Link
              href={"/"}
              className="hover:bg-main6 rounded-[30px] px-4 py-[13px]"
              prefetch={false}
            >
              <p>{t("home")}</p>
            </Link>
            <Link
              href={"/landing/about"}
              className={`hover:bg-main6  router.pathname === "/landing/about" && "bg-main6"
            } rounded-[30px] px-4 py-[13px]`}
              prefetch={false}
            >
              <p>{t("about")}</p>
            </Link>
          </nav>
          <div
            className="lg:hidden"
            onClick={() => {
              setOpenBergerMenu(true);
              document.body.style.overflow = "hidden";
            }}
          >
            <HambergerMenu size={22} />
          </div>
        </header>
        <div
          className={`flex lg:hidden flex-col w-full border-b-[1px] border-gray5 pt-[15px] pb-[15px]
         shadow-md fixed z-[500] top-0 bg-white px-4`}
        >
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              <div className="flex  items-center">
                <div
                  className={`relative ${
                    lang == "ar" ? "w-[46px]" : "w-[816px] lg:w-[205px]"
                  } rtl:ml-3 ltr:mr-3`}
                >
                  <Image
                    src={lang == "ar" ? "/assets/images/itikaf.png" : "/assets/images/itikaf.png"}
                    alt={"logo"}
                    layout="fill"
                  />
                </div>
                <span className="text-[14px] text-default">اعتکاف معنویت تمدن ساز</span>
              </div>
              <HambergerMenu
                size={24}
                color="#292D32"
                className="mx-1"
                onClick={() => setShowLangModal(true)}
              />
            </div>
          </div>
        </div>
        {showLangModal && (
          <div className="h-screen fixed flex flex-col bottom-0 z-[9999999] w-full top-0 left-0 bg-white">
            <Header onClick={() => setShowLangModal(false)} title={t("setting")} />
            <ChangeLang />
          </div>
        )}

        {showSearchView && (
          <GlobalSearchModal
            lang={lang}
            tHome={tHome}
            setShowSearchView={setShowSearchView}
            showSearchView={showSearchView}
          />
        )}
        {confirm ? (
          <Script
            type="text/javascript"
            src="https://farsicomcrm.com/pages/formbuilder/ravesh-formbuilder.js"
            form-url="https://farsicomcrm.com/jahadi/formView/1288"
            form-style="inline"
            form-theme=""
          ></Script>
        ) : (
          <div className="flex flex-col mt-20 lg:mt-0">
            <div className="p-4 leading-8 text-justify">
              <p className="font-bold text-center text-[18px] mb-4">بسم الله الرحمن الرحیم</p>
              <p>
                با توجه به ضرورت و اهمیت جمع آوری اطلاعات مورد نیاز جهت برنامه ریزی دقیق و منسجم
                برای سالهای آتی در سطح کشور، از کلیه کنش‌گران و مسئولین مردمی اعتکاف، درخواست می‌شود
                اطلاعات مسجد محل برگزاری اعتکاف مربوط به منطقه خود را در این سامانه به ثبت برسانید.
              </p>
            </div>
            <button
              onClick={handleConfirm}
              className="bg-default p-4 rounded-md mb-4
          text-base w-[90%] mx-auto text-white mt-4 lg:w-[200px]"
            >
              {t("confirm")}
            </button>
          </div>
        )}
      </div>
      {showLogin && (
        <ModalScreen open={showLogin}>
          <Login
            setShowLogin={setShowLogin}
            modalMode={true}
            t={t}
            landingRoute={router.asPath}
            justAssociation={true}
            customTitle={
              "شما به درخواست ستاد اجتماعات مهدوی وارد این صفحه شده اید و برای ثبت فرم لازم است ابتدا وارد شوید"
            }
          />
        </ModalScreen>
      )}
    </>
  );
}
