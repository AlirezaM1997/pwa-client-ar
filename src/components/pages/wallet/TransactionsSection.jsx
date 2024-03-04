import { useState } from "react";
import { getCookie } from "cookies-next";
import { useWindowSize } from "@uidotdev/usehooks";
// FUNCTION
import { getDate } from "@functions/getDate";
import { moneyFormatter } from "@functions/moneyFormatter";
// COMPONENT
import DepositeTransactionsSection from "@components/pages/wallet/DepositeTransactionsSection";
import WithdrawlTransactionsSection from "@components/pages/wallet/WithdrawlTransactionsSection";
import dynamic from "next/dynamic";
// COMPONENT DYNAMIC IMPORT
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const TransactionDetails = dynamic(() => import("@components/pages/wallet/TransactionDetails"), {
  ssr: false,
});
const CustomTransitionModal = dynamic(() => import("@components/kit/modal/CustomTransitionModal"), {
  ssr: false,
});

export default function TransactionsSection({ t, tW }) {
  const size = useWindowSize();
  const lang = getCookie("NEXT_LOCALE");

  const [depositeShow, setDepositeShow] = useState(false);
  const [withdrawlShow, setWithdrawlShow] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsData, setDetailsData] = useState({
    status: "DONE",
    amount: 0,
    date: null,
    shabaNumber: null,
    cartNumber: null,
    description: null,
  });

  return (
    <>
      <div className="w-full px-4 pt-[12px] lg:p-0 bg-white grid grid-cols-2 lg:border-b-[1px] lg:border-gray5">
        <button
          className={`title1 lg:text-[16px] lg:font-medium lg:leading-[40px] ${
            withdrawlShow
              ? "border-b-[2px] border-main2 lg:border-none  text-main2 lg:text-white lg:bg-main2"
              : "text-black "
          } pb-[13px] lg:pb-0 h-[34px] lg:h-[58px]`}
          onClick={() => {
            setDepositeShow(false);
            setWithdrawlShow(true);
          }}
        >
          {tW("withdrawal")}
        </button>
        <button
          className={`title1 lg:text-[16px] lg:font-medium lg:leading-[40px] ${
            depositeShow
              ? "border-b-[2px] border-main2 lg:border-none text-main2 lg:text-white lg:bg-main2"
              : "text-black"
          } pb-[13px] lg:pb-0 h-[34px] lg:h-[58px]`}
          onClick={() => {
            setDepositeShow(true);
            setWithdrawlShow(false);
          }}
        >
          {tW("deposit")}
        </button>
      </div>
      <div className="px-4 pb-[100px] lg:pb-0">
        {depositeShow && (
          <DepositeTransactionsSection
            t={t}
            tW={tW}
            lang={lang}
            setOpenDetails={setOpenDetails}
            setDetailsData={setDetailsData}
          />
        )}

        {withdrawlShow && (
          <WithdrawlTransactionsSection
            t={t}
            tW={tW}
            lang={lang}
            setOpenDetails={setOpenDetails}
            setDetailsData={setDetailsData}
          />
        )}
      </div>

      {size.width < 960 ? (
        <BottomSheet open={openDetails} setOpen={setOpenDetails}>
          <div className="px-4 pb-6">
            <TransactionDetails
              t={t}
              tW={tW}
              isIncrease={depositeShow}
              status={detailsData.status}
              date={getDate(detailsData.date, lang, true)}
              amount={moneyFormatter(detailsData.amount)}
              shabaNumber={detailsData.shabaNumber}
              cartNumber={detailsData.cartNumber}
              description={detailsData.description}
            />
          </div>
        </BottomSheet>
      ) : (
        <CustomTransitionModal
          hasCloseBtn={false}
          open={openDetails}
          close={() => setOpenDetails(false)}
          width="416px"
        >
          <div className="lg:p-[25px] pb-3">
            <TransactionDetails
              t={t}
              tW={tW}
              isIncrease={depositeShow}
              status={detailsData.status}
              date={getDate(detailsData.date, lang, true)}
              amount={moneyFormatter(detailsData.amount)}
              shabaNumber={detailsData.shabaNumber}
              cartNumber={detailsData.cartNumber}
              description={detailsData.description}
            />
          </div>
        </CustomTransitionModal>
      )}
    </>
  );
}
