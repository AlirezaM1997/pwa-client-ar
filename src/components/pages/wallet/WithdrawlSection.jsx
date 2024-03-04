import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowDown2, Card } from "iconsax-react";
import { useWindowSize } from "@uidotdev/usehooks";
import { exceptThisSymbols } from "@constants/index";
import { useMutation, useQuery } from "@apollo/client";
// GQL
import { REQUEST_WITHDRAW } from "@services/gql/mutation/REQUEST_WITHDRAW";
import { GET_MY_SHABA_WALLETS } from "@services/gql/query/GET_MY_SHABA_WALLETS";
// FUNCTION
import { moneyFormatter } from "@functions/moneyFormatter";
import { formatCartNumber } from "@functions/formatCartNumber";
import { removeNonNumeric } from "@functions/removeNonNumeric";
// COMPONENT
import Loading from "@components/kit/loading/Loading";
import PlainInput from "@components/kit/Input/PlainInput";
import CustomButton from "@components/kit/button/CustomButton";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import RecommendedAmount from "@components/common/RecommendedAmount";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const CustomTransitionModal = dynamic(() => import("@components/kit/modal/CustomTransitionModal"), {
  ssr: false,
});

export default function WithdrawlSection({ t, tW, setSectionShowNumber }) {
  //HOOK
  const router = useRouter();
  const size = useWindowSize();

  //STATE
  const [amount, setAmount] = useState(null);
  const [amountText, setAmountText] = useState(null);
  const [_account, _setAccount] = useState(null);
  const [account, setAccount] = useState(null);
  const [allCartArray, setAllCartArray] = useState(null);
  const [openCartList, setOpenCartList] = useState(false);
  const [description, setDescription] = useState("");

  //GRAPHQL
  const [withdrawal_mutation] = useMutation(REQUEST_WITHDRAW);
  const { data, loading, error } = useQuery(GET_MY_SHABA_WALLETS);

  //FUNCTION
  const handleChange = (event) => {
    setAmountText(moneyFormatter(removeNonNumeric(event.target.value.replace(/^0/, ""))));
    setAmount(Number(event.target.value.replace(/,/g, "")));
  };

  const withdrawalFunc = async () => {
    const variables = {
      description,
      amount: Number(amount),
      walletId: account._id,
    };
    console.log(variables);
    if (amount > 100000000) {
      toast.custom(() => <Toast text={tW("maxWithdrawalError")} status="ERROR" />);
    } else {
      try {
        const {
          data: { request_withdraw },
        } = await withdrawal_mutation({
          variables,
        });
        if (request_withdraw.status === 200) {
          toast.custom(() => <Toast text={t("successfulRequestToast")} />);
          setTimeout(() => {
            toast.remove();
            if (size.width < 960) router.push("/wallet/transactions", undefined, { shallow: true });
            else setSectionShowNumber(4);
          }, 2000);
        }
      } catch (error) {
        toast.custom(() => <Toast text={error.message} status="ERROR" />);
      }
    }
  };

  useEffect(() => {
    if (data) {
      const res = data.get_my_shaba_wallets.filter((item) => !!item.cartNumber);
      setAllCartArray(res);
    }
  }, [data, loading]);
  const CartList = () => {
    return (
      <div className=" pb-[32px] lg:p-[25px] ">
        <div className="px-2 flex flex-col mb-14 lg:max-h-[400px] lg:overflow-y-auto" dir="ltr">
          {allCartArray?.length !== 0 ? (
            allCartArray?.map((item, index) => (
              <div
                key={index}
                className={`py-4 px-2 flex items-center gap-x-3 cursor-pointer ${
                  _account === item
                    ? "border-[1px] border-main1 rounded-lg"
                    : "border-b-[1px] border-gray5"
                }`}
                onClick={() => {
                  _setAccount(item);
                }}
              >
                <div className="w-[40px] h-[40px] rounded-lg bg-main8 flex items-center justify-center">
                  <Card size={20} color="#00839E" />
                </div>
                <div>
                  <div className="flex items-center textInput lg:text-[16px] lg:font-bold lg:leading-[22px] text-gray2">
                    <p>{formatCartNumber(item.cartNumber)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-2 lg:p-0">
              <p className="heading lg:text-[24px] lg:font-bold lg:leading-[40px] mb-2 lg:mb-0 text-right">
                {tW("noShabaForSettlementTitle")}
              </p>
              <p className="caption1 lg:text-[18px] lg:font-normal lg:leading-[30px] mb-[45px] lg:mb-[22px] text-right">
                {tW("noShabaForSettlementDes")}
              </p>
            </div>
          )}
        </div>
        <div className="fixed bg-white w-full bottom-0 h-[80px] lg:hidden"></div>
        <div className="px-5 lg:px-0 fixed lg:static bottom-[14px] lg:bottom-[25px] w-full">
          <CustomButton
            onClick={
              allCartArray.length !== 0
                ? () => {
                    document.body.style.overflow = "unset";
                    setOpenCartList(false);
                    setAccount(_account);
                  }
                : () => {
                    document.body.style.overflow = "unset";
                    if (size.width < 960)
                      router.push("/wallet/accounts", undefined, { shallow: true });
                    else setSectionShowNumber(3);
                  }
            }
            title={allCartArray.length !== 0 ? t("confirm") : tW("addAccount")}
            isFullWidth={true}
            size="M"
          />
        </div>
      </div>
    );
  };

  if (error) return <h5>{error.message}</h5>;
  if (loading || !allCartArray) return size.width < 960 ? <LoadingScreen /> : <Loading />;
  return (
    <>
      <section className="lg:flex lg:flex-col lg:justify-between lg:h-full">
        <div className="px-4 pt-[30px] lg:p-0">
          <div className="relative">
            <PlainInput
              value={amountText}
              onChange={handleChange}
              labelText={tW("withdrawalAmountLabel")}
              placeholder={tW("increaseInput")}
              maxLength={11}
              onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()}
              pattern="\d*"
              inputMode="numeric"
            />
            <span className="caption3 absolute ltr:right-3 rtl:left-3 top-[56%]">{t("toman")}</span>
          </div>
          <RecommendedAmount
            t={t}
            amount={amount}
            setAmount={setAmount}
            setAmountText={setAmountText}
            isWithdrawal={true}
          />

          <div className="mt-[100px] lg:mt-5">
            <div className=" relative">
              <div className={`titleInput  lg:font-bold lg:leading-[40px] mb-[8px] lg:mb-[10px]`}>
                {tW("accounts")}
              </div>
              <input
                className="w-full rounded-lg border-[1px] border-gray5 py-2 lg:py-[14px] px-4 textInput text-black placeholder:text-gray4 focus:ring-0 focus:outline-none cursor-pointer"
                placeholder={tW("selectAccount")}
                value={formatCartNumber(account?.cartNumber)}
                onClick={() => setOpenCartList(!openCartList)}
                readOnly
              />
              <span
                onClick={() => setOpenCartList(!openCartList)}
                className=" absolute ltr:right-3 rtl:left-3 top-[72%] lg:top-[76%] -translate-y-1/2 cursor-pointer"
              >
                <ArrowDown2 size={20} />
              </span>
            </div>
          </div>

          <div className={"mt-[45px]"}>
            <PlainInput
              value={description}
              setValue={setDescription}
              labelText={t("description")}
              placeholder={t("description")}
              maxLength={40}
              showMaxLengthLabel
              characterCount={description?.length}
            />
          </div>
        </div>

        <div className="fixed bottom-[14px] w-full px-4 lg:p-0 lg:static lg:flex lg:justify-end lg:w-full">
          <CustomButton
            onClick={() => withdrawalFunc(true)}
            title={t("confirm")}
            isFullWidth={size.width < 960 ? true : false}
            width={size.width < 960 ? "" : "w-[180px]"}
            size="M"
            isDisabled={amount < 20000 || !account || !amount}
            isPointerEventsNone={amount < 20000 || !account || !amount}
          />
        </div>
      </section>

      {size.width < 960 ? (
        <BottomSheet open={openCartList} setOpen={setOpenCartList} disableDrag={true}>
          <CartList />
        </BottomSheet>
      ) : (
        <CustomTransitionModal
          hasCloseBtn={false}
          open={openCartList}
          close={() => setOpenCartList(false)}
          width="435px"
        >
          <CartList />
        </CustomTransitionModal>
      )}
    </>
  );
}
