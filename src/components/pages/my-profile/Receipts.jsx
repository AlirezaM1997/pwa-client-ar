import { useState, useEffect } from "react";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLazyQuery } from "@apollo/client";
import NoResult from "@components/common/NoResult";
import { useWindowSize } from "@uidotdev/usehooks";
import { getRequirementsName } from "@functions/getRequirementsName";
import { getCookie } from "cookies-next";
import { GET_PROJECTS_PARTICIPATIONS_RECEIPT } from "@services/gql/query/GET_PROJECTS_PARTICIPATIONS_RECEIPT";
import ReceiptCard from "@components/common/ReceiptCard";

export default function Receipts({ t, tPA }) {
  const size = useWindowSize();
  const lang = getCookie("NEXT_LOCALE");
  const limit_item = size.width < 960 ? 6 : 12;
  const [participations, setParticipations] = useState([]);
  const [page, setPage] = useState(0);
  const requirements = [
    { name: "FINANCIAL" },
    { name: "MORAL" },
    { name: "IDEAS" },
    { name: "CAPACITY" },
    { name: "PRESSENCE" },
    { name: "SKILL" },
  ];
  const [selectedTab, setSelectedTab] = useState(1);

  const [getParticipationsReceipt, { loading, error, data, fetchMore }] = useLazyQuery(
    GET_PROJECTS_PARTICIPATIONS_RECEIPT,
    {
      variables: {
        page: 0,
        limit: limit_item,
        participationType: requirements[selectedTab - 1].name,
      },
    }
  );

  useEffect(() => {
    if (!data && page === 0) getParticipationsReceipt();
    if (data && page === 0) {
      setParticipations(data?.get_projects_participations_receipt?.result);
      setPage(1);
    }
  }, [data, page]);

  useEffect(() => {
    getParticipationsReceipt();
    setPage(0);
  }, [selectedTab]);

  const total = data?.get_projects_participations_receipt?.total ?? 0;

  const fetchingMore = () => {
    if (!data) return;
    fetchMore({ variables: { page } })
      .then(({ data }) => {
        setParticipations([
          ...participations,
          ...(data?.get_projects_participations_receipt?.result
            ? data.get_projects_participations_receipt.result
            : null),
        ]);
        setPage(page + 1);
      })
      .catch((e) => console.log("error", e));
  };

  if (error) return <h5>{error.message}</h5>;

  return (
    <div className="flex flex-col w-full">
      <div className="border-b-[1px] lg:border-b-[3px] border-gray6 relative py-[8px] lg:py-[16px] px-1 flex justify-between gap-x-6 chipsFilter">
        {requirements.map((i, j) => (
          <button
            key={j}
            className={`text-[14px] leading-[20px] font-medium lg:text-[18px] relative ${
              selectedTab === j + 1
                ? "text-main2 before:content-[''] before:absolute before:h-[3px] before:lg:h-[6px] before:w-full before:left-1/2 before:-translate-x-1/2 before:top-[130%] before:lg:top-[160%] before:bg-main2  before:rounded-t-[1.5px] before:lg:rounded-t-[4px] before:z-10"
                : "text-gray1"
            } `}
            onClick={() => {
              setSelectedTab(j + 1);
            }}
          >
            {getRequirementsName(i.name, lang)}
          </button>
        ))}
      </div>
      {loading ? (
        <LoadingScreen />
      ) : (
        <InfiniteScroll
          dataLength={participations?.length ?? 0}
          hasMore={limit_item * page < total}
          next={fetchingMore}
          style={{ overflow: "unset" }}
          key={Math.random()}
        >
          <div className="lg:grid lg:grid-cols-2 gap-x-4 lg:gap-4 lg:mt-3">
            {participations?.map((item, index) => (
              <ReceiptCard t={t} tPA={tPA} receipt={item} key={"ParticipationCard" + index} />
            ))}
          </div>

          {participations?.length === 0 && <NoResult />}
        </InfiniteScroll>
      )}
    </div>
  );
}
