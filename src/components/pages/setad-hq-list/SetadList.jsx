import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import InfiniteScroll from "react-infinite-scroll-component";
// GQL
import { GET_SETAD_LIST } from "@services/gql/query/GET_SETAD_LIST";
// COMPONENT
import Card from "./Card";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
// COMPONENT DYNAMIC IMPORT
const NoResult = dynamic(() => import("@components/common/NoResult"), { ssr: false });

export default function SetadList() {
  const size = useWindowSize();
  const limit_item = size.width < 960 ? 9 : 24;
  const [result, setResult] = useState([]);
  const [page, setPage] = useState(0);

  const [getSetadList, { error, loading, data, fetchMore }] = useLazyQuery(GET_SETAD_LIST, {
    variables: { limit: limit_item, page: 0 },
  });

  useEffect(() => {
    if (!data && page === 0) getSetadList();
    if (data && page === 0) {
      setResult(data?.get_setad_list?.result);
      setPage(1);
    }
  }, [data, page]);

  const total = data?.get_setad_list?.total ?? 0;

  const fetchingMore = () => {
    if (!data) return;
    fetchMore({ variables: { page } })
      .then(({ data }) => {
        setResult([
          ...result,
          ...(data?.get_setad_list?.result ? data.get_setad_list.result : null),
        ]);
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
              isHq={false}
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
