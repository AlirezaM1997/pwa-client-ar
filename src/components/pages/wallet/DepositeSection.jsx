import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useMutation } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import { exceptThisSymbols } from "@constants/index";
// GQL
import { CHARGE_BALANCE } from "@services/gql/mutation/CHARGE_BALANCE";
// FUNCTION
import { moneyFormatter } from "@functions/moneyFormatter";
import { removeNonNumeric } from "@functions/removeNonNumeric";
// COMPONENT
import dynamic from "next/dynamic";
import RecommendedAmount from "@components/common/RecommendedAmount";
import PlainInput from "@components/kit/Input/PlainInput";
import CustomButton from "@components/kit/button/CustomButton";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });

export default function DepositeSection({ setRedirectLoading, tW, t }) {
  const size = useWindowSize();
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();

  const [over100MError, setOver100MError] = useState(false);
  const [amount, setAmount] = useState(null);
  const [amountText, setAmountText] = useState(null);

  const [charge_balance] = useMutation(CHARGE_BALANCE);

  const handleChange = (event) => {
    setAmountText(moneyFormatter(removeNonNumeric(event.target.value.replace(/^0/, ""))));
    setAmount(Number(event.target.value.replace(/,/g, "")));
  };

  const increaseCreditFunc = async () => {
    const variables = {
      amount: Number(amount),
      redirectTo: `/${lang}/wallet`,
      src: "pwa",
    };
    if (amount > 100000000) {
      setOver100MError(true);
    } else {
      setRedirectLoading(true);
      setOver100MError(false);
      try {
        const { data } = await charge_balance({
          variables,
        });
        if (data) {
          window.location.href = data.charge_balance;
        }
      } catch (error) {
        setRedirectLoading(false);
        toast.custom(() => <Toast text={error?.message} status="ERROR" />);
      }
    }
  };
  return (
    <>
      <div className="lg:flex lg:flex-col lg:justify-between lg:h-full">
        <div className="px-4 lg:p-0">
          <p className="heading mb-1 lg:mb-2 lg:text-[22px] lg:font-bold lg:leading-[40px]">
            {tW("increaseCredit")}
          </p>
          <p className="cta2 text-gray2 mb-[50px]">{tW("increaseDes")}</p>
          <div className="relative">
            <PlainInput
              value={amountText}
              onChange={handleChange}
              placeholder={tW("increaseInput")}
              maxLength={11}
              onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()}
              pattern="\d*"
              inputMode="numeric"
            />
            <span className="caption3 absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2">
              {t("toman")}
            </span>
          </div>
          <RecommendedAmount
            t={t}
            amount={amount}
            setAmount={setAmount}
            setAmountText={setAmountText}
            isWithdrawal={false}
          />
          {over100MError ? (
            <div className="flex items-center justify-center mt-3">
              <p className="title1 text-danger">{tW("maxIncreaseError")}</p>
            </div>
          ) : null}
        </div>
        <div className="mt-[55px] lg:m-0 lg:flex lg:justify-end lg:w-full pb-9 px-4 lg:p-0">
          <CustomButton
            onClick={increaseCreditFunc}
            title={t("confirm")}
            isFullWidth={size.width < 960 ? true : false}
            width={size.width < 960 ? "" : "w-[180px]"}
            size="M"
            isDisabled={!amount || amount < 10000}
            isPointerEventsNone={!amount || amount < 10000}
          />
        </div>
      </div>
    </>
  );
}
