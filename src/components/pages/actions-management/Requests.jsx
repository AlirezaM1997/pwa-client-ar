import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import InfiniteScroll from "react-infinite-scroll-component";
// GQL
import { USER_GET_MY_PROJECT_REQUESTS } from "@services/gql/query/USER_GET_MY_PROJECT_REQUESTS";
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
    USER_GET_MY_PROJECT_REQUESTS,
    {
      variables: { state: "requests", limit: limit_item, page: 0 },
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    if (!data && page === 0) getRequests();
    if (data && page === 0) {
      if (search.length > 0) {
        setTimeout(() => {
          setRequests(data?.user_get_my_project_requests?.result);
          setPage(1);
        }, 1000);
      } else {
        setRequests(data?.user_get_my_project_requests?.result);
        setPage(1);
      }
    }
  }, [data, search, page]);

  // useEffect(() => {
  //   if (search.length > 0) {
  //     setPage(0);
  //     getRequests({
  //       variables: { state: "requests", limit: limit_item, page: 0, search },
  //     });
  //   } else {
  //     setPage(0);
  //     getRequests();
  //   }
  // }, [search]);

  const total = data?.user_get_my_project_requests?.total ?? 0;

  const fetchingMore = () => {
    if (!data) return;
    fetchMore({ variables: { page } })
      .then(({ data }) => {
        setRequests([
          ...requests,
          ...(data?.user_get_my_project_requests?.result
            ? data.user_get_my_project_requests.result
            : null),
        ]);
        setPage(page + 1);
      })
      .catch((e) => console.log("error", e));
  };

  if (error) return <h5 className="text-center pt-[70px]">{error.message}</h5>;
  if (loading)
    return (
      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-x-4 w-full">
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
            className="flex justify-center mb-5 w-full min-h-[240px] 400:min-h-[257px] 480:min-h-[292px]"
          >
            <ProjectCard
              data={i}
              refetch={refetch}
              isRequest={true}
              isPrivate={true}
              loadingHeight="h-[260px]"
              cardId={i._id}
              t={t}
              imgUrl={i?.imgs && i?.imgs[0] ? i?.imgs[0] : null}
              imgHeight="h-[180px] 400:h-[220px] 480:h-[240px]"
              openInNewTab={true}
            />
          </div>
        ))}
      </div>
      {requests?.length === 0 && <NoResult />}
    </InfiniteScroll>
  );
}
