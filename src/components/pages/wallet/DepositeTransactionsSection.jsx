import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import InfiniteScroll from "react-infinite-scroll-component";
// GQL
import { GET_MY_INVOICES } from "@services/gql/query/GET_MY_INVOICES";
// FUNCTION
import { moneyFormatter } from "@functions/moneyFormatter";
// COMPONENT
import Loading from "@components/kit/loading/Loading";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import TransactionCard from "@components/pages/wallet/TransactionCard";
// COMPONENT DYNAMIC IMPORT
const NoResult = dynamic(() => import("@components/common/NoResult"), { ssr: false });

export default function DepositeTransactionsSection({
  t,
  tW,
  lang,
  setDetailsData,
  setOpenDetails,
}) {
  const size = useWindowSize();
  const limit_item = size.width < 960 ? 8 : 6;
  const [result, setResult] = useState([]);
  const [page, setPage] = useState(0);

  const [getProjects, { error, loading, data, fetchMore }] = useLazyQuery(GET_MY_INVOICES, {
    variables: { limit: limit_item, page: 0 },
    fetchPolicy: "no-cache",
  });

  const total = data?.get_my_invoices?.total ?? 0;

  useEffect(() => {
    if (!data && page === 0) getProjects();
    if (data && page === 0) {
      setResult(data?.get_my_invoices?.result);
      setPage(1);
    }
  }, [data, page]);

  const fetchingMore = () => {
    if (!data) return;
    fetchMore({ variables: { page } })
      .then(({ data }) => {
        setResult([...result, ...(data?.get_my_invoices?.result ?? null)]);
        setPage(page + 1);
      })
      .catch((e) => console.log("error", e));
  };

  if (error) return <h5>{error.message}</h5>;
  if (loading) return size.width < 960 ? <LoadingScreen /> : <Loading loadingHeight="469px" />;
  return (
    <>
      {size.width > 960 && (
        <div className="grid grid-cols-3 text-[22px] font-bold leading-[40px] pt-[45px] pb-[14px] border-b-[1px] border-gray5">
          <p>{t("statusHeader")}</p>
          <p>{t("date")}</p>
          <p>{t("amount")}</p>
        </div>
      )}
      <InfiniteScroll
        dataLength={result?.length ?? 0}
        hasMore={limit_item * page < total}
        next={fetchingMore}
        style={{ overflow: "unset" }}
      >
        <div>
          {result?.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setOpenDetails(true);
                setDetailsData({
                  status: item.status,
                  amount: item.amount,
                  date: item.createdAt,
                  shabaNumber: null,
                });
              }}
            >
              <TransactionCard
                t={t}
                tW={tW}
                isDeposit={true}
                isSuccess={String(item.status).toUpperCase() === "DONE"}
                date={item.createdAt}
                amount={moneyFormatter(item.amount)}
                lang={lang}
              />
            </div>
          ))}
        </div>
        {result?.length === 0 && <NoResult />}
      </InfiniteScroll>
    </>
  );
}
