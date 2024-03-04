import dynamic from "next/dynamic";
import { Edit } from "iconsax-react";
import Image from "next/legacy/image";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import InputOtp from "@onefifteen-z/react-input-otp";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
//GQL
import { USER_ME } from "@services/gql/query/USER_ME";
import { ASSOCIATION_ME } from "@services/gql/query/ASSOCIATION_ME";
import { USER_AUTH_STEP_TWO } from "@services/gql/mutation/USER_AUTH_STEP_TWO";
import { ASSOCIATION_AUTH_STEP_TWO } from "@services/gql/mutation/ASSOCIATION_AUTH_STEP_TWO";
//REDUX
import { tokenAction } from "@store/slices/token";
import { isUserAction } from "@store/slices/isUser";
import { accountsAction } from "@store/slices/accounts";
//COMPONENT
import Timer from "./Timer";
import Loading from "@components/kit/loading/Loading";
//COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });

export default function OTP({ t, phoneNumber, setSendCode, user, landingRoute }) {
  const [loading, setLoading] = useState(false);
  const [incorrectCode, setIncorrectCode] = useState(false);
  const accounts = useSelector((state) => state.accounts.accounts);
  const [otpCode, setOtpCode] = useState("");
  const [user_mutation] = useMutation(USER_AUTH_STEP_TWO);
  const [association_mutation] = useMutation(ASSOCIATION_AUTH_STEP_TWO);
  const [getUserData] = useLazyQuery(USER_ME);
  const [getAssociationData] = useLazyQuery(ASSOCIATION_ME);
  const dispatch = useDispatch();
  const backRoute = getCookie("BACK_ROUTE");

  const w = async (otpCode) => {
    if (otpCode.length == 4) {
      setLoading(true);
      if (user) {
        try {
          const {
            data: { user_auth_stepTwo },
          } = await user_mutation({
            variables: {
              phoneNumber: `+${phoneNumber}`,
              code: otpCode,
            },
          });
          if (user_auth_stepTwo.token) {
            // window.webengage.user.login(user_auth_stepTwo._id);
            // window.webengage.user.setAttribute("we_phone", `+${phoneNumber}`);
            setIncorrectCode(false);
            dispatch(
              tokenAction({
                token: user_auth_stepTwo.token,
                refreshHash: user_auth_stepTwo.refreshHash,
                _id: user_auth_stepTwo._id,
              })
            );
            dispatch(isUserAction({ isUser: true }));
            dispatch(
              accountsAction({
                accounts: [
                  ...accounts,
                  {
                    token: user_auth_stepTwo.token,
                    refreshHash: user_auth_stepTwo.refreshHash,
                    name: user_auth_stepTwo.name,
                    _id: user_auth_stepTwo._id,
                    phoneNumber,
                    isUser: true,
                    lang: "en",
                  },
                ],
              })
            );
            setTimeout(() => {
              getUserData().then((data) => {
                setCookie("NEXT_LOCALE", String(data.data.user_me?.lang).toLowerCase());
                document.location.replace(
                  `/${String(data.data.user_me?.lang).toLowerCase() === "ar" ? "ar" : "en"}/${
                    backRoute ? backRoute : landingRoute
                  }`
                );
              });
              deleteCookie("BACK_ROUTE");
            }, 500);
          }
        } catch (error) {
          setLoading(false);
          if (error.message === "incorrect code") {
            setIncorrectCode(true);
          } else {
            toast.custom(() => <Toast text={error.message} status="ERROR" />);
          }
        }
      } else {
        try {
          const {
            data: { association_auth_stepTwo },
          } = await association_mutation({
            variables: {
              phoneNumber: `+${phoneNumber}`,
              code: otpCode,
            },
          });
          if (association_auth_stepTwo.token) {
            // window.webengage.user.login(association_auth_stepTwo._id);
            // window.webengage.user.setAttribute("we_phone", `+${phoneNumber}`);
            setIncorrectCode(false);
            dispatch(
              tokenAction({
                token: association_auth_stepTwo.token,
                refreshHash: association_auth_stepTwo.refreshHash,
                _id: association_auth_stepTwo._id,
              })
            );
            dispatch(isUserAction({ isUser: false }));
            dispatch(
              accountsAction({
                accounts: [
                  ...accounts,
                  {
                    token: association_auth_stepTwo.token,
                    refreshHash: association_auth_stepTwo.refreshHash,
                    name: association_auth_stepTwo.name,
                    _id: association_auth_stepTwo._id,
                    phoneNumber,
                    isUser: false,
                    lang: "en",
                  },
                ],
              })
            );
            setTimeout(() => {
              getAssociationData().then((data) => {
                setCookie("NEXT_LOCALE", String(data.data?.association_me?.lang).toLowerCase());
                document.location.replace(
                  `/${
                    String(data.data.association_me?.lang).toLowerCase() === "ar" ? "ar" : "en"
                  }/${backRoute ? backRoute : landingRoute}`
                );
              });
              deleteCookie("BACK_ROUTE");
            }, 500);
          }
        } catch (error) {
          setLoading(false);
          if (error.message === "incorrect code") {
            setIncorrectCode(true);
          } else {
            toast.custom(() => <Toast text={error.message} status="ERROR" />);
          }
        }
      }
    }
  };

  useEffect(() => {
    const active = document.querySelector(".styles_otpInput__2umfM");
    if (active) active.focus();

    // autofill otp
    const ac = new AbortController();
    navigator?.credentials &&
      navigator.credentials
        .get({
          otp: { transport: ["sms"] },

          signal: ac?.signal,
        })
        .then((otp) => {
          if (otp) {
            setOtpCode(otp?.code);
            setTimeout(() => {
              w(otp?.code);
              ac.abort();
            }, 300);
          }
        })
        .catch((err) => {
          ac.abort();
          console.log("err in autofill:", err);
        });
  }, []);

  return (
    <>
      <section className="w-full h-screen lg:flex lg:items-center 2xl:max-w-[1320px] 2xl:mx-auto">
        <div className={`w-[65%] h-[614px] relative hidden lg:block`}>
          <Image
            src={"/assets/images/loginDesktop.jpg"}
            layout="fill"
            alt={"login-desktop"}
          ></Image>
        </div>
        <div className="lg:w-[35%]">
          <div className="flex justify-center items-center flex-col pt-[134px] lg:pt-0">
            <Timer
              t={t}
              user={user}
              phoneNumber={phoneNumber}
              setIncorrectCode={setIncorrectCode}
            />
          </div>
          <div
            dir="ltr"
            className="flex justify-center items-center pt-[40px] pb-[20px] lg:pt-[50px] lg:pb-[25px]"
          >
            <InputOtp otpLength={4} numberOnly={true} onChange={(e) => w(e)} value={otpCode} />
          </div>
          {incorrectCode && <h1 className="text-center mb-4">{t("login.incorrectCode")}</h1>}
          <div className="flex justify-center items-center gap-x-2">
            <div className="flex ltr:flex-row rtl:flex-row-reverse">
              <span className="text-[16px] lg:text-[18px] font-medium leading-[26px] text-gray1 ">
                +
              </span>
              <p className="text-[16px] lg:text-[18px] font-medium leading-[26px] text-gray1 ">
                {phoneNumber}
              </p>
            </div>
            <div className=" cursor-pointer" onClick={() => setSendCode(false)}>
              <Edit color="#03A6CF" size={20} />
            </div>
          </div>
          {loading && <Loading loadingHeight="150px" />}
        </div>
      </section>
      <style>{`
      .styles_otpInput__2umfM{
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 33px;
        background : #56C3E033;
        border-radius: 14px;
        width : 71px;
        height:71px;
        border:none;
        }
      .styles_otpInputWrapper__DkICY {
        width : 71px;
        height:71px;
        max-width: unset;
        }
      .styles_otpWrapper__ZaQlv{
        width:100%
        }
      `}</style>
    </>
  );
}
