import Link from "next/link";
import dynamic from "next/dynamic";
import { Call } from "iconsax-react";
import Image from "next/legacy/image";
import { useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";
import { useSelector } from "react-redux";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { useWindowSize } from "@uidotdev/usehooks";
import { useMutation, useQuery } from "@apollo/client";
import { LoginLockOuter, LoginLockInner } from "@lib/svg";
import parsePhoneNumber, { isValidNumberForRegion } from "libphonenumber-js";
//GQL
import { USER_ME } from "@services/gql/query/USER_ME";
import { ASSOCIATION_ME } from "@services/gql/query/ASSOCIATION_ME";
import { USER_AUTH_STEP_ONE } from "@services/gql/mutation/USER_AUTH_STEP_ONE";
import { ASSOCIATION_AUTH_STEP_ONE } from "@services/gql/mutation/ASSOCIATION_AUTH_STEP_ONE";
import { USER_AUTH_STEP_ONE_PROD } from "@services/gql/mutation/USER_AUTH_STEP_ONE_PROD";
import { ASSOCIATION_AUTH_STEP_ONE_PROD } from "@services/gql/mutation/ASSOCIATION_AUTH_STEP_ONE_PROD";
//COMPONENT
import Header from "@components/common/Header";
import CustomButton from "@components/kit/button/CustomButton";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import { useRouter } from "next/router";
import { Trans } from "react-i18next";
//COMPONENT DYNAMIC IMPORT
const OTP = dynamic(() => import("./OTP"), { ssr: false });
const CustomModal = dynamic(() => import("@components/kit/modal/CustomModal"), { ssr: false });
const LoginToggleButton = dynamic(() => import("@components/common/login/LoginToggleButton"), {
  ssr: false,
});

export default function Login({
  t,
  modalMode = false,
  setShowLogin,
  landingRoute = "/",
  justAssociation = false,
  justUser = false,
  customTitle = null,
}) {
  const size = useWindowSize();
  const lang = getCookie("NEXT_LOCALE");

  const [user, setUser] = useState(true);
  const [association, setAssociation] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeBtn, setActiveBtn] = useState(false);
  const [sendCode, setSendCode] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [flag, setFlag] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  //////////////////////////////////////////////////////
  const [user_mutation] = useMutation(USER_AUTH_STEP_ONE);
  const [association_mutation] = useMutation(ASSOCIATION_AUTH_STEP_ONE);

  const _user = useQuery(USER_ME);
  const _association = useQuery(ASSOCIATION_ME);
  const accounts = useSelector((state) => state.accounts.accounts);
  const repeatedLogin = accounts.filter((item) => item.phoneNumber === phoneNumber);
  const ref = useRef();
  const router = useRouter();

  useEffect(() => {
    const isAssociation = router.query.association === "true";
    if (isAssociation || justAssociation) {
      setAssociation(true);
      setUser(false);
    } else {
      setAssociation(false);
      setUser(true);
    }
  }, [router.query.association]);

  const handleOnChange = (phoneInputValue, country) => {
    const phone = parsePhoneNumber(`+${phoneInputValue}`);
    const phoneNumberFormatted = phone?.formatNational();

    const res =
      phoneNumberFormatted &&
      phoneNumberFormatted?.length > 10 &&
      isValidNumberForRegion(phoneNumberFormatted, String(country.countryCode).toUpperCase());

    setActiveBtn(res);

    if (res) {
      setPhoneNumber(phoneInputValue);
    }
  };

  const login = async () => {
    setFlag(true);
    setShowWarning(false);
    if (repeatedLogin.length > 0) {
      setError(true);
      setErrorMessage(t("login.duplicateNumber"));
    } else {
      setError(false);
      const variables = {
        phoneNumber: `+${phoneNumber}`,
        platform: "WEB",
        origin: String(window.location.href).toLowerCase().indexOf("www") > -1 ? "WWW" : "NON_WWW",
      };
      if (user) {
        try {
          const {
            data: { user_auth_stepOne },
          } = await user_mutation({
            variables,
          });
          if (user_auth_stepOne.status === 200) {
            setSendCode(true);
            setFlag(false);
          }
        } catch (error) {
          setError(true);
          setErrorMessage(error?.message);
        }
      } else {
        try {
          const {
            data: { association_auth_stepOne },
          } = await association_mutation({
            variables,
          });
          if (association_auth_stepOne.status == 200) {
            setSendCode(true);
            setFlag(false);
          }
        } catch (error) {
          setError(true);
          setErrorMessage(error?.message);
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      if (activeBtn) {
        justAssociation || justUser ? login() : setShowWarning(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if ((flag && !error) || _user.loading || _association.loading) return <LoadingScreen />;
  return (
    <>
      {size.width > 960 && (
        <div className=" absolute top-[34px] ltr:left-[40px] rtl:right-[40px] cursor-pointer z-[9999999]">
          <Link href={"/"} prefetch={false}>
            <div className=" relative w-[180px] h-[48px]">
              <Image
                alt="logo"
                src={
                  lang == "ar"
                    ? "/assets/images/logo-mofid-fa.png"
                    : "/assets/images/logo-mofid.png"
                }
                layout="fill"
              />
            </div>
          </Link>
        </div>
      )}
      {!sendCode && (
        <div
          className={`relative w-full pb-[120px] h-full lg:flex lg:items-center lg:px-[40px] justify-center ${
            modalMode ? "min-h-screen" : " lg:pt-[90px] 2xl:max-w-[1320px] 2xl:mx-auto"
          }`}
        >
          {modalMode && size.width < 960 && (
            <Header
              title={""}
              onClick={() => {
                document.body.style.overflow = "unset";
                setShowLogin(false);
              }}
            />
          )}
          <div className={`w-[65%] h-[614px] relative hidden lg:block`}>
            <Image
              src={"/assets/images/loginDesktop.jpg"}
              layout="fill"
              alt={"login-desktop"}
            ></Image>
          </div>
          <section
            className={`${
              !modalMode ? "pt-[75px]" : ""
            }  lg:pt-[15px] flex flex-col items-center justify-start h-full lg:w-[35%]`}
          >
            <div className="flex flex-col items-center px-5">
              <div className="w-[100px] h-[100px] rounded-[22px] bg-main6 flex justify-center items-center ">
                <div className="relative">
                  <LoginLockOuter w={29} h={34} />
                  <div className="absolute top-1/2 z-10 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <LoginLockInner w={8.63} h={14} />
                  </div>
                </div>
              </div>
              <h1 className="pt-[16px] pb-[30px] text-[20px] font-light lg:pt-[22px] lg:pb-[42px] lg:text-[25px] lg:font-light">
                {t("login.welcome")}
              </h1>
              {customTitle ? (
                <p className="mb-4 text-center text-[16px] font-semibold leading-[26px] lg:text-[16px] lg:leading-[28px]">
                  {customTitle}
                </p>
              ) : (
                <div className="flex flex-col items-center px-[38px]">
                  <h1 className="mb-1 lg:mb-3 text-[16px] font-bold leading-[26px] lg:text-[18px] lg:leading-[22px]">
                    {t("login.header")}
                  </h1>
                  <h2 className="text-[14px] lg:text-[16px] font-normal leading-[26px] lg:leading-[32px] text-center">
                    {justAssociation ? (
                      t("login.headerDesJustAssociation")
                    ) : justUser ? (
                      <Trans i18nKey="login.headerDesJustUser" />
                    ) : (
                      t("login.headerDes")
                    )}
                  </h2>
                </div>
              )}
            </div>
            {!justAssociation && !justUser && (
              <div className="w-full px-5 mb-[30px]">
                <LoginToggleButton
                  user={user}
                  setUser={setUser}
                  association={association}
                  setAssociation={setAssociation}
                />
              </div>
            )}
            <div className="w-full px-5">
              <label className="flex items-center justify-start mb-[6px]" htmlFor="phoneInputLogin">
                <Call size={16} />
                <h5 className="caption2 mr-[6px] ltr:ml-[6px]">{t("login.phoneNumber")}</h5>
              </label>
              <h5 className="title2 mr-[6px] ltr:ml-[6px] mb-[6px]">
                {t("login.hintPhoneNumberWithout0")}
              </h5>
              <div dir="ltr">
                <PhoneInput
                  enableSearch={true}
                  value={phoneNumber}
                  onChange={handleOnChange}
                  country={"ir"}
                  excludeCountries={["il"]}
                  placeholder={"+989385277300"}
                  inputStyle={{
                    width: "100%",
                    height: "44px",
                    padding: "14px",
                    paddingLeft: "52px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    borderColor: "#E8E8E8",
                  }}
                  buttonStyle={{
                    backgroundColor: "white",
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                    borderColor: "#E8E8E8",
                  }}
                  searchClass="!py-[10px] !px-2"
                  onKeyDown={handleKeyDown}
                />
              </div>
              {error && (
                <p className="text-[12px] font-bold leading-[22px] text-danger p-2">
                  {errorMessage}
                </p>
              )}
            </div>
            <div className="mt-[90px] flex flex-col w-full items-center px-5">
              <CustomButton
                onClick={() => {
                  justAssociation || justUser ? login() : setShowWarning(true);
                }}
                title={t("login.sendCode")}
                isFullWidth={true}
                size="M"
                isDisabled={!activeBtn}
                isPointerEventsNone={!activeBtn}
              />
              <div className="text-center caption2 mt-2" dir="rtl">
                {t("login.policy_1")}
                <Link href={"/terms"} prefetch={false} className="font-bold">
                  {`${t("terms")} ${t("and")} ${t("conditions")} `}
                </Link>
                {lang === "en" && t("login.agree")}
              </div>
            </div>
          </section>
        </div>
      )}

      {sendCode && (
        <OTP
          t={t}
          phoneNumber={phoneNumber}
          setSendCode={setSendCode}
          user={user}
          landingRoute={landingRoute}
          setFlag={setFlag}
        />
      )}

      {showWarning && (
        <div ref={ref}>
          <CustomModal
            title={user ? t("login.userWarningTitle") : t("login.associationWarningTitle")}
            description={t("login.userWarningDes")}
            openState={showWarning}
            cancelOnClick={() => setShowWarning(false)}
            okOnClick={() => {
              setShowWarning(false);
              login();
            }}
            hasOneButton={false}
            bgColor=""
            okLabel={t("continue")}
            cancelLabel={t("cancel")}
          />
        </div>
      )}
    </>
  );
}
