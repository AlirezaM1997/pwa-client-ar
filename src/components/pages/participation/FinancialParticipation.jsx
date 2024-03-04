import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import { ArrowLeft, ArrowRight, Wallet3 } from "iconsax-react";
import { exceptThisSymbols } from "@constants/index";
//FUNCTION
import { moneyFormatter } from "@functions/moneyFormatter";
import { removeNonNumeric } from "@functions/removeNonNumeric";
import { saveToStorage } from "@functions/saveToStorage";
//GQL
import { FINANCIAL_PARTICIPATE_IN_PROJECT } from "@services/gql/mutation/FINANCIAL_PARTICIPATE_IN_PROJECT";
import { ZARINPAL_FINANCIAL_PARTICIPATION } from "@services/gql/mutation/ZARINPAL_FINANCIAL_PARTICIPATION";
//COMPONENT
import PlainInput from "@components/kit/Input/PlainInput";
import CustomButton from "@components/kit/button/CustomButton";
import RecommendedAmount from "@components/common/RecommendedAmount";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const Login = dynamic(() => import("@components/common/login/Main"), { ssr: false });
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });
const CustomTransitionModal = dynamic(() => import("@components/kit/modal/CustomTransitionModal"), {
  ssr: false,
});

export default function FinancialParticipation({
  projectId,
  t,
  tPA,
  lang,
  showDescription,
  setRedirectLoading,
}) {
  //VARIABLE
  const size = useWindowSize();
  const router = useRouter();
  const token = useSelector((state) => state.token.token);
  const [financial_participate] = useMutation(FINANCIAL_PARTICIPATE_IN_PROJECT);
  const [zarinpal_financial_participation] = useMutation(ZARINPAL_FINANCIAL_PARTICIPATION);
  const [showLogin, setShowLogin] = useState(false);
  const [openPaymentBottomSheet, setOpenPaymentBottomSheet] = useState(false);
  const [noEnoughMoney, setNoEnoughMoney] = useState(false);
  const [amount, setAmount] = useState(null);
  const [amountText, setAmountText] = useState(null);
  const [minimumMoneyError, setMinimumMoneyError] = useState(false);
  const [maximumMoneyError, setMaximumMoneyError] = useState(false);

  const handleChange = (event) => {
    setAmountText(moneyFormatter(removeNonNumeric(event.target.value.replace(/^0/, ""))));
    setAmount(Number(event.target.value.replace(/,/g, "")));
  };

  const submitFinancial = () => {
    if (amount >= 10000 && amount <= 100000000) {
      setMinimumMoneyError(false);
      setMaximumMoneyError(false);
      // if (!token) {
      //   gatewayPayment();
      // } else {
        setOpenPaymentBottomSheet(true);
      // }
    } else {
      if (amount >= 100000000) {
        setMaximumMoneyError(true);
        setMinimumMoneyError(false);
      } else {
        setMinimumMoneyError(true);
        setMaximumMoneyError(false);
      }
    }
  };

  const gatewayPayment = async () => {
    setRedirectLoading(true);
    const variables = {
      amount: Number(amount),
      projectId: projectId,
      redirectTo: `/${lang}/project-profile/${projectId}`,
      src: "pwa",
    };
    try {
      const { data } = await zarinpal_financial_participation({
        variables,
      });
      if (data) {
        window.location.href = data.zarinpal_financial_participation;
      }
    } catch (error) {
      setRedirectLoading(false);
      if (error.message == "You cannot participate in your own project") {
        toast.custom(() => (
          <Toast text={tPA("errorParticipateFinancialyInYourProject")} status="ERROR" />
        ));
        setOpenPaymentBottomSheet(false);
      }
    }
  };

  const creditPayment = async () => {
    const variables = {
      projectId: projectId,
      amount: Number(amount),
    };
    try {
      const {
        data: { unsafe_financial_participation_in_project },
      } = await financial_participate({
        variables,
      });
      if (unsafe_financial_participation_in_project.status === 200) {
        setOpenPaymentBottomSheet(false);
        setAmount(10000);
        setAmount(null);
        setAmountText(null);
        setNoEnoughMoney(false);
        router.push(
          {
            pathname: `/project-profile/${projectId}`,
          },
          undefined,
          { shallow: true }
        );
        saveToStorage("participationResult", 1);
      }
    } catch (error) {
      if (error.message === "Authorization failed" || error.message === "Token required") {
        setOpenPaymentBottomSheet(false);
        setShowLogin(true);
      } else if (error.message == "u dont have enough coin :( ") {
        setOpenPaymentBottomSheet(false);
        setNoEnoughMoney(true);
      } else if (error.message == "u cant participate financialy in ur own project") {
        toast.custom(() => (
          <Toast text={tPA("errorParticipateFinancialyInYourProject")} status="ERROR" />
        ));
        setOpenPaymentBottomSheet(false);
      } else {
        router.push(
          {
            pathname: `/project-profile/${projectId}`,
          },
          undefined,
          { shallow: true }
        );
        saveToStorage("participationResult", 0);
        saveToStorage("participationType", "FINANCIAL");
      }
    }
  };

  //COMPONENT
  const Payment = () => {
    return (
      <div className="pb-5 px-4 lg:p-[25px]">
        <h1 className="title1 lg:text-[18px] lg:font-bold lg:leading-[40px] pb-[2px]">
          {tPA("paymentType")}
        </h1>
        <p className="caption3 text-gray4 lg:text-[16px] lg:font-medium lg:leading-[40px] pb-4">
          {tPA("paymentTypeDes")}
        </p>
        <div>
          <div
            onClick={() => creditPayment()}
            className="bg-gray6 px-[10px] lg:px-3 py-2 lg:py-4 cursor-pointer rounded-lg mb-[15px] flex items-center justify-between"
          >
            <div className=" flex items-center gap-x-2 lg:gap-x-4">
              <div className="bg-[#56C3E033] rounded-lg flex items-center justify-center w-[37px] h-[37px] lg:w-[52px] lg:h-[52px] p-[8px]">
                <Wallet3 color="#00839E" size={size.width < 960 ? 24 : 30} />
              </div>
              <div>
                <h1 className="title2 lg:text-[18px] lg:font-bold lg:leading-[40px]">
                  {tPA("creditPayment")}
                </h1>
                <p className="caption3 lg:text-[16px] lg:font-medium lg:leading-[30px] text-gray4">
                  {tPA("creditPaymentDes")}
                </p>
              </div>
            </div>
            <div className="w-[18px] h-[18px] lg:w-[36px] lg:h-[36px] rounded-full flex items-center justify-center bg-[#56C3E033] p-[4px]">
              {lang == "ar" ? <ArrowLeft color="#00839E" /> : <ArrowRight color="#00839E" />}
            </div>
          </div>
          {/* <div
            onClick={() => gatewayPayment()}
            className="bg-gray6 px-[10px] lg:px-3 py-2 lg:py-4 cursor-pointer rounded-lg flex items-center justify-between"
          >
            <div className=" flex items-center gap-x-2 lg:gap-x-4">
              <div className="bg-[#56C3E033] rounded-lg flex items-center justify-center w-[37px] h-[37px] lg:w-[52px] lg:h-[52px] p-[8px]">
                <Wallet3 color="#00839E" size={size.width < 960 ? 24 : 30} />
              </div>
              <div>
                <h1 className="title2 lg:text-[18px] lg:font-bold lg:leading-[40px]">
                  {tPA("gatewayPayment")}
                </h1>
                <p className="caption3 lg:text-[16px] lg:font-medium lg:leading-[30px] text-gray4">
                  {tPA("gatewayPaymentDes")}
                </p>
              </div>
            </div>
            <div className="w-[18px] h-[18px] lg:w-[36px] lg:h-[36px] rounded-full flex items-center justify-center bg-[#56C3E033] p-[4px]">
              {lang == "ar" ? <ArrowLeft color="#00839E" /> : <ArrowRight color="#00839E" />}
            </div>
          </div> */}
        </div>
      </div>
    );
  };

  //JSX
  return (
    <>
      <section
        className={`w-full px-4 pt-4 pb-[120px] 2xl:max-w-[1320px] 2xl:mx-auto  ${
          showDescription ? "2xl:mx-auto" : ""
        }  `}
      >
        <header className="lg:hidden">
          <div className="pt-[14px]">
            <h1 className="title4 pb-[10px] text-center">{tPA("financialP")}</h1>
          </div>
        </header>
        <section className="lg:flex lg:items-center lg:gap-x-[30px] xl:gap-x-[60px] 2xl:gap-x-[70px] lg:mt-[55px] ">
          <div className="w-full h-[620px] relative hidden mx-auto lg:block">
            <Image
              src="/assets/images/financial-participation.png"
              layout="fill"
              quality={100}
              unoptimized
              objectFit="cover"
              alt="financial-participation"
            ></Image>
          </div>
          <main className="flex flex-col items-center w-full lg:w-[75%]">
            <div className="w-[300px] h-[300px] relative mx-auto lg:hidden">
              <Image
                src="/assets/images/financial-participation.png"
                layout="fill"
                alt="financial-participation"
              ></Image>
            </div>
            <div className="w-full ltr:text-left rtl:text-right mb-16 hidden lg:block">
              <div className="flex ltr:flex-col rtl:flex-col-reverse">
                <h2 className="headingDesktop2">{t("requirements.financial")}</h2>
                <h2 className="headingDesktop2">{t("donation")}</h2>
              </div>
            </div>

            <p className=" text-gray2 text-center mb-3">{tPA("financialAmountCustom")}</p>

            <div className="relative w-full">
              <PlainInput
                value={amountText}
                onChange={handleChange}
                placeholder={tPA("importDonationAmount")}
                maxLength={11}
                onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                pattern="\d*"
                inputMode="numeric"
                hasMarginBottom={false}
              />
              <span className="caption3 absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2">
                {t("toman")}
              </span>
            </div>
            <div className="w-full mt-4">
              <RecommendedAmount
                t={t}
                amount={amount}
                setAmount={setAmount}
                setAmountText={setAmountText}
                isWithdrawal={false}
              />
            </div>

            {noEnoughMoney && (
              <div className="flex items-center justify-center caption3 mt-6">
                <p className=" text-danger text-center ml-4 text-lg">{tPA("notEnoughCredit")}</p>
              </div>
            )}

            {minimumMoneyError && (
              <p className=" text-danger text-center caption3 mt-6">
                {tPA("minimumParticipationAmount")}
              </p>
            )}

            {maximumMoneyError && (
              <p className=" text-danger text-center caption3 mt-6">
                {tPA("maximumParticipationAmount")}
              </p>
            )}

            <div className="px-4 lg:px-0 w-full fixed lg:static bottom-0 lg:mt-[30px] bg-white lg:bg-transparent shadow lg:shadow-none pb-5 pt-3 lg:pb-0 lg:pt-0">
              <CustomButton
                title={tPA("participateNow")}
                onClick={submitFinancial}
                isFullWidth={true}
                size="M"
              />
            </div>
          </main>
        </section>
      </section>

      {size.width < 960 ? (
        <BottomSheet open={openPaymentBottomSheet} setOpen={setOpenPaymentBottomSheet}>
          <Payment />
        </BottomSheet>
      ) : (
        <CustomTransitionModal
          open={openPaymentBottomSheet}
          close={() => setOpenPaymentBottomSheet(false)}
          width="650px"
        >
          <Payment />
        </CustomTransitionModal>
      )}

      {showLogin && (
        <ModalScreen open={showLogin}>
          <Login setShowLogin={setShowLogin} modalMode={true} t={t} landingRoute={router.asPath} />
        </ModalScreen>
      )}

    </>
  );
}
