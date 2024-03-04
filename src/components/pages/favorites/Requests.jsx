import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import InfiniteScroll from "react-infinite-scroll-component";
// GQL
import { GET_BOOKMARKED_REQUESTS } from "@services/gql/query/GET_BOOKMARKED_REQUESTS";
// COMPONENT
import ProjectCard from "@components/kit/card/project-card/Main";
import ProjectCardSkeleton from "@components/kit/card/project-card-skeleton/Main";
// COMPONENT DYNAMIC IMPORT
const NoResult = dynamic(() => import("@components/common/NoResult"), { ssr: false });

export default function Requests({ t, search }) {
  const size = useWindowSize();
  const limit_item = size.width < 960 ? 6 : 12;
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);

  const [getRequests, { error, loading, data, fetchMore, refetch }] = useLazyQuery(
    GET_BOOKMARKED_REQUESTS,
    {
      variables: { limit: limit_item, page: 0, filters: { search: "" } },
      fetchPolicy: "no-cache",
    }
  );

  const total = data?.get_bookmarked_requests?.total ?? 0;

  useEffect(() => {
    if (!data && page === 0 && search.length === 0) getRequests();
    if (data && page === 0) {
      setRequests(data?.get_bookmarked_requests?.result);
      setPage(1);
    }
  }, [data, search, page]);

  useEffect(() => {
    if (search.length > 0) {
      setPage(0);
      getRequests({ variables: { limit: limit_item, page: 0, filters: { search } } });
    } else {
      setPage(0);
      getRequests();
    }
  }, [search]);

  const fetchingMore = () => {
    if (!data) return;
    fetchMore({ variables: { page } })
      .then(({ data }) => {
        setRequests([...requests, ...(data?.get_bookmarked_requests?.result ?? null)]);
        setPage(page + 1);
      })
      .catch((e) => console.log("error", e));
  };

  if (error) return <h5>{error.message}</h5>;
  if (loading)
    return (
      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-x-4">
        {Array.from({ length: 15 }, (_, i) => i + 1).map((item) => (
          <div
            key={item}
            className="flex justify-center w-full min-h-[280px] 400:min-h-[300px] 480:min-h-[340px]"
          >
            <ProjectCardSkeleton
              favorite={true}
              searchPage={true}
              isRequest={true}
              imgHeight="h-[180px] 400:h-[220px] 480:h-[240px]"
            />
          </div>
        ))}
      </div>
    );

  return (
    <InfiniteScroll
      dataLength={requests?.length ?? 0}
      hasMore={limit_item * page < total}
      next={fetchingMore}
      style={{ overflow: "unset" }}
    >
      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-x-4">
        {requests?.map((i, index) => (
          <div
            key={index}
            className="flex justify-center mb-5 w-full"
          >
            <ProjectCard
              data={i}
              isRequest={true}
              t={t}
              cardId={i._id}
              isPrivate={false}
              loadingHeight="h-[260px]"
              refetch={refetch}
              imgHeight="h-[180px] 400:h-[220px] 480:h-[240px]"
              imgUrl={i?.imgs && i?.imgs[0] ? i?.imgs[0] : null}
              openInNewTab={true}
            />
          </div>
        ))}
      </div>
      {requests?.length === 0 && <NoResult />}
    </InfiniteScroll>
  );
}
