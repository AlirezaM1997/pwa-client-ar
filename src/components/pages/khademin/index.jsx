/* eslint-disable react/no-unknown-property */
import Script from "next/script";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getCookie } from "cookies-next";
import { HambergerMenu } from "iconsax-react";
import ChangeLang from "@components/common/ChangeLang";
import Header from "@components/common/Header";
import GlobalSearchModal from "@components/common/globalSearchModal/Main";
import Link from "next/link";
import useClickOutside from "@hooks/useClickOutside";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { ASSOCIATION_ME } from "@services/gql/query/ASSOCIATION_ME";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import { useEffect } from "react";
const Login = dynamic(() => import("@components/common/login/Main"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });

export default function KhademinPage() {
  const { t } = useTranslation();
  const { t: tHome } = useTranslation("home");
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();
  // const [showLogin, setShowLogin] = useState(false);
  const [showSearchView, setShowSearchView] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openBergerMenu, setOpenBergerMenu] = useState(false);
  const handleConfirm = () => {
    setConfirm(true);
  };
  const elementRefs = useClickOutside([() => setShowLangModal(false)]);
  // const { data, loading, error } = useQuery(ASSOCIATION_ME, { fetchPolicy: "no-cache" });

  // useEffect(() => {
  //   if (!loading && (!data || error)) {
  //     setShowLogin(true);
  //   }
  // }, [data, loading, error]);

  // if (loading) return <LoadingScreen />;
  return (
    <>
      <div className="flex flex-col w-full">
        <header className="hidden px-4 lg:px-[30px] pt-2 lg:pt-4 sticky lg:flex items-center justify-between mb-4">
          <Link href={"/"} className="flex items-center gap-2" prefetch={false}>
            <div className="relative w-[86px] h-[86px]">
              <Image
                alt="logo"
                src={
                  lang == "ar" ? "/assets/images/setad-logo.png" : "/assets/images/setad-logo.png"
                }
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
                    src={
                      lang == "ar"
                        ? "/assets/images/setad-logo.png"
                        : "/assets/images/setad-logo.png"
                    }
                    alt={"logo"}
                    layout="fill"
                  />
                </div>
                <span className="text-[14px] text-default">ستاد مردمی اجتماعات مهدوی</span>
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
          form-url="https://farsicomcrm.com/jahadi/formView/1267"
          form-style="inline"
          form-theme=""
        ></Script>
      ) : (
        <div className="flex flex-col mt-20 lg:mt-0">
          <p className="p-4 leading-8 text-justify">
            <p className="font-bold text-center text-[18px] mb-4">بسم الله الرحمن الرحیم</p>
            <strong>سلام علیكم</strong>
            <br />
            <strong>لطفا پیش از ثبت نام متن زیر را به دقت مطالعه نمائید.</strong>
            <br />
            همان‌گونه كه می‌دانید مسأله تعظیم شعائر در دین مبین اسلام از جایگاه مهمی برخوردار است.
            <br />
            «ذَلِكَ وَمَنْ يُعَظِّمْ شَعَائِرَ اللَّهِ فَإِنَّهَا مِنْ تَقْوَى الْقُلُوبِ » (سوره حج آیه ۳۲ )
            <br />
            جشن بزرگ و میلیونی نیمه شعبان قم که هر ساله با حضور عاشقان امام زمان عجل
            الله تعالی فرجه الشریف از سراسر ایران اسلامی و حتی برخی کشورهای جهان برگزار می‌شود بستری
            برای بزرگداشت و ابراز محبت به ساحت ائمه اطهار علیهم السلام به خصوص امام عصر ارواحنا فداه
            است.
            <br />
            ستاد مردمی اجتماعات مهدوی به عنوان مسئول مردمی این حماسه بزرگ در نظر دارد از بین افراد
            علاقمند خدمت رسانی به زائران و مشتاقان آن حضرت، خادم افتخاری در زمینه های زیر جذب نماید:
            <div className="h-4 "></div>
            <br />
            ۱. امور پشتیبانی از مواکب
            <br />
            که شامل:خدمت جهت توزیع آب،کپسول گاز، نان و امور پشتیبانی ستادی از مواکب می‌گردد.
            <br />
            <div className="h-4 "></div>
            ۲.انتظامات و خادم راهور مسیر بلوار پیامبراعظم صلی الله علیه و آله جهت تسهیل در عبور و
            مرور وسایل نقلیه و نظم دهی به ایستگاه های صلواتی
            <div className="h-4 "></div>
            <br />
            ۳.رسانه و فضای مجازی
            <br />
            که شامل:
            <br />
            تصویر برداری،فیلم برداری و انتشار هر چه بیشتر این حرکت بزرگ در فضای
            مجازی.
            <div className="h-4 "></div>
            <br />
            ۴.تولید محتوا:
            <br />
            از جمله کارهای گرافیکی، تدوین، تهیه مستند، پوستر، تیزر و ....
            <div className="h-4 "></div>
            <br />
            ۵. امور فرهنگی و تبلیغی:
            <br />
            انجام فعالیت های فرهنگی و حضور مبلغین در مسیرهای منتهی به مسجد مقدس جمکران و همچنین مکان
            های تعیین شده جهت اسکان زائرین
            <div className="h-4 "></div>
            <br />
            ۶. امور اسکان:
            <br />
            استقرار و خدمت در مکان‌های تعیین شده جهت اسکان زائر و همچنین راهنمای زائر برای اسکان
            <div className="h-4 "></div>
            <br />
            ۷. حمل و نقل:
            <br />
            در این بخش به یاری افراد دارای وسیله نقلیه سبک و سنگین از جمله باری و سواری و همچنین
            افراد دارای موتورسیکلت نیازمند می‌باشیم‌.
            <div className="h-4 "></div>
            <br />
            نکته:
            <br />
            ✓موارد فوق بخش عمده‌ای از فعالیت های ستاد بوده که نیازمند یاری داوطلبانه خادمیاران امام
            زمان علیه السلام دارد.
            <br />
            ✓اولویت در جذب خادم، افراد جوان و با توان جسمی قابل قبول و ترجیحاً ساکن شهر قم می‌باشد.
            <br />
            ✓بیشترین حجم از فعالیت‌ها در فاصله زمانی یکم تا هفتم اسفندماه بوده و پیش از این بازه،
            فعالیت‌های تخصصی درحال انجام خواهد بود که به خادمین عرصه‌های تخصصی اطلاع داده خواهد شد.
            <br />✓ در صورتی‌که اقدام به ثبت‌نام نمودید منتظر اطلاع‌رسانی‌های بعدی از طرف ستاد
            باشید.
            <br />
            ✓ خادمی در جشن نیمه شعبان ویژه برادران است.
          </p>
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
      {/* {showLogin && (
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
      )} */}
    </>
  );
}
