import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import InfiniteScroll from "react-infinite-scroll-component";
// GQL
import { GET_HQ_LIST } from "@services/gql/query/GET_HQ_LIST";
// COMPONENT
import Card from "./Card";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
// COMPONENT DYNAMIC IMPORT
import NoResult from "@components/common/NoResult";

export default function HqList() {
  const size = useWindowSize();
  const limit_item = size.width < 960 ? 9 : 24;
  const [result, setResult] = useState([]);
  const [page, setPage] = useState(0);

  const [getHqList, { error, loading, data, fetchMore }] = useLazyQuery(GET_HQ_LIST, {
    variables: { limit: limit_item, page: 0 },
  });

  useEffect(() => {
    if (!data && page === 0) getHqList();
    if (data && page === 0) {
      setResult(data?.get_hq_list?.result);
      setPage(1);
    }
  }, [data, page]);

  const total = data?.get_hq_list?.total ?? 0;

  const fetchingMore = () => {
    if (!data) return;
    fetchMore({ variables: { page } })
      .then(({ data }) => {
        setResult([...result, ...(data?.get_hq_list?.result ? data.get_hq_list.result : null)]);
        setPage(page + 1);
      })
      .catch((e) => console.log("error", e));
  };

  if (error) return <h5>{error.message}</h5>;
  if (loading) return <LoadingScreen />;

  return (
    <InfiniteScroll
      dataLength={result?.length ?? 0}
      hasMore={limit_item * page < total}
      next={fetchingMore}
      style={{ overflow: "unset" }}
    >
      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4">
        {result.map((i, index) => (
          <div key={index} className="py-6 w-full border-b-[1px]">
            <Card
              isHq={true}
              cardId={i._id}
              name={i.name}
              imgUrl={i.image ? i.image : "/assets/images/default-association-image.png"}
              openInNewTab={true}
            />
          </div>
        ))}
      </div>

      {result?.length === 0 && <NoResult />}
    </InfiniteScroll>
  );
}
