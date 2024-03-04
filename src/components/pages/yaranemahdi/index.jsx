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

export default function YaranemahdiPage() {
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
            form-url="https://farsicomcrm.com/jahadi/formView/1277"
            form-style="inline"
            form-theme=""
          ></Script>
        ) : (
          <div className="flex flex-col mt-20 lg:mt-0">
            <div className="p-4 leading-8 text-justify">
              <p className="font-bold text-center text-[18px] mb-4">بسم الله الرحمن الرحیم</p>
              <strong>«من یعظم شعائر الله فانها من تقوی القلوب»</strong>
              <br /> همانگونه كه میدانید مسأله <strong>تعظیم شعائر</strong> در دین مبین اسلام از
              جایگاه مهمی برخوردار است و ایستگاه صلواتی و موکب محلی برای ابراز محبت به ساحت ائمه
              اطهار علیهم السلام و محبین آن حضرات است و كاركرد مهمی در تعظیم شعائر دارد.
              <br /> با توجه به حضور میلیونی زائران و دلدادگان امام زمان عجل الله تعالی فرجه در ایام
              نیمه شعبان، نقشآفرینی مجموعه‌های مختلف مردمی جهت تعظیم شعائر اهل بیت علیهم السلام،
              بخصوص ترویج فرهنگ مهدوی ضروریست.
              <br /> لذا از شما خواستاریم در صورت توان و تمایل جهت خدمت رسانی به زائران ضمن مطالعه
              موارد ذیل با ما همراه و همافزا باشید.
              <br /> لازم به ذکر است فعالیت‌های موکب میتواند در عرصه فرهنگی، خدماتی ، پذیرایی، ر
              سانهای و یا تلفیقی از آنها باشد.
              <br /> <strong>نكات ضروری</strong> پیرامون عضویت در ستاد مردمی اجتماعات مهدوی جهت
              برگزاری هر چه باشکوه تر جشن نیمه شعبان:
              <br /> 1. «ستاد مردمی اجتماعات مهدوی» ستادی مردمی است و به هیچ نهادی وابسته نبوده و از
              مجموعه‌های مردمی تشكیل شده است.
              <br /> 2. عضویت در ستاد در برنامه‌های پیشرو مانع از استفاده نام مجموعه خودتان در
              برنامه نیست و صرفاً در قسمتی از ایستگاه یا موکب نماد ستاد استفاده میشود. (این امر به
              معنای تأیید مجموعه شما برای ناظرین ارگان‌های مختلف محسوب میشود)
              <br /> 3. مسئولیت موکب با شخصی میباشد كه نام ایشان به عنوان مسئول موکب (ایستگاه) در
              فرم عضویت ثبت می شود.
              <br /> 4. ضمن احترام؛ با توجه به فضای معنوی بلوار و آیین دینی بودن مراسم، در زمان
              برپایی ایستگاه استفاده از هر نوع موسیقی ممنوع میباشد.
              <br /> 5. ثبتنام در ستاد مردمی به معنای پذیرفتن شرایط اخذ مجوز شهرداری نیز میباشد.(جهت
              ثبت رسمی)
              <br /> 6. تمامی اطلاع رسانی‌ها در گروه و کانال مسئولین مواکب انجام میشود، لذا داشتن
              فضای مجازی و فعالیت مدام مسئول مجموعه در گروهی که در ایتا تشکیل شده‌است ضروریست.
              <br /> 7. محور اصلی جانمایی موکب‌ها و پشتیبانی ستادی در محدوده بلوار پیامبر اعظم بوده
              و اولویت جانمایی در آن با کسانی میباشد که زودتر ثبتنام نمایند. درصورت تکمیل ظرفیت
              بلوار، جانمایی مواکب در مسیرهای دیگر منتهی به مسجد مقدس جمکران خواهد بود.
              <br /> 8. مسئولین موکب‌ها موظف به تدبیر و برنامه‌ریزی مناسب برای رعایت مسائل امنیت،
              ایمنی و بهداشتی از جمله همراه داشتن کپسول آتشنشانی، استحکام سازه و بهداشت محیط
              میباشند.
              <br /> 9. متراژ درخواستی موکبداران پس از بررسی نوع و میزان فعالیت‌های اعلام شده در فرم
              ثبتنام تأیید یا اصلاح میگردد. توجه داشته باشید که عمق سازه بیش از 3 متر نمیتواند باشد.
              (توضیح متراژ ها به طور مثال:موکب ۳ در ۱۸ یعنی ۳ متر عمق موکب و ۱۸ متر طول آن است)
              <br /> 10. جهت جلوگیری از قطعی برق در اثر مصرف بالا، استفاده از هر گونه لامپ رشتهای و
              پروژکتورهای پر مصرف و همچنین بخاری برقی مطلقا ممنوع میباشد.
              <br /> 11. وسایل مورد نیاز هر موکب:
              <br /> الف).تانکر آب با ظرفیت حداقل ۲ هزار لیتر (در صورت نیاز به حجم بالای آب و عدم
              وجود منبع مناسب، خادمین ستاد مسئولیتی ندارند) <br />
              ب)کابل برق فشار قوی به متراژ حداقل ۲۰ متر و رعایت نکات ایمنی برق
              <br /> ج)کپسول آتشنشانی
              <br /> د)سطل زباله
              <br /> 12. حداقل زمان فعالیت ایستگاه و موکب(بدون در نظر گرفتن زمانی که صرف برپایی و
              جمع آوری سازه می شود) از جمعه 4 اسفند ماه 1402 تا شام نیمه شعبان یکشنبه 6 اسفند
              میباشد، اما مواکب باید حداقل از روز پنجشنبه 3 اسفند قبل از نیمه شعبان در قم حضور داشته
              باشند.
              <br /> 13. مسئولین مواکب موظف به تهیه کارت شناسایی ویژه خادمین موکب خود و استفاده از
              نماد ستاد در کارت میباشند.
              <br /> 14. با توجه به قرار گرفتن برنامه در ایام تبلیغات انتخابات مجلس شورای اسلامی،
              ضمن توصیه به برنامهریزی در جهت جلب مشارکت حداکثری در انتخابات، به صورت جدی از تبلیغ
              فرد یا حزب خاص پرهیز شود.
              <br /> 15. تمامی فعالیت‌های مواکب می‌بایست در چهارچوب قوانین نظام مقدس جمهوری اسلامی
              انجام پذیرد. <br />
              <br />
              <strong>موارد زیر توسط ستاد انجام میگردد:</strong>
              <br /> 1. اخذ مجوز از ارگان‌های مربوطه(در صورت داشتن شرایط لازم)
              <br /> 2. جانمایی مجموعه‌ها باتوجه به امکانات و فعالیت‌ها و امتیازاتی که دارند.
              <br /> 3. آبرسانی به مواکب (بشرط داشتن منبع آب با ظرفیت حداقل آب مصرفی یک روز مجموعه
              شما)
              <br /> 4. کمک به مجموعه شما برای مهار و ایمنی سازه
              <br /> 5. تسهیل در تأمین کپسول گاز
              <br /> 6. معرفه به نهاد مربوطه جهت تهیه ارزاق با نرخ تعاونی
              <br /> 7. ساماندهی استقرار مواکب و نظارت بر فعالیت‌ها
              <br /> 8. تلاش در راستای انعکاس هرچه بهتر برنامه‌ها توسط رسانه‌ها
              <br />
              <br /> قوانین مربوط به برنامه را مطالعه کردم می پذیرم
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
