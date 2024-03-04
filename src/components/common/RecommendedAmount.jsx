// FUNCTION
import { moneyFormatter } from "@functions/moneyFormatter";

export default function RecommendedAmount({ amount, setAmount, setAmountText, t, isWithdrawal }) {
  const recommendedAmount = [isWithdrawal ? 20000 : 10000, 50000, 100000, 1000000];

  return (
    <>
      <div className="flex items-center justify-between lg:justify-center lg:gap-x-[30px]">
        {recommendedAmount.map((item, index) => (
          <div
            key={index + 1}
            className={` rounded-lg px-[6px] lg:px-[12px] py-1 cursor-pointer caption3 lg:text-[14px] lg:font-bold lg:leading-[40px] ${
              amount == 10000 && index == 0 && !isWithdrawal
                ? "bg-main2 text-white"
                : amount == 20000 && index == 0 && isWithdrawal
                ? "bg-main2 text-white"
                : amount == 50000 && index == 1
                ? "bg-main2 text-white"
                : amount == 100000 && index == 2
                ? "bg-main2 text-white"
                : amount == 1000000 && index == 3
                ? "bg-main2 text-white"
                : "bg-main7"
            }`}
            onClick={() => {
              setAmount(item);
              setAmountText(moneyFormatter(item));
            }}
          >{`${moneyFormatter(item)} ${t("toman")}`}</div>
        ))}
      </div>
    </>
  );
}
