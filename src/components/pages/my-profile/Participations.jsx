import { useState, useEffect } from "react";
import ProjectCard from "@components/kit/card/project-card/Main";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLazyQuery } from "@apollo/client";
import { GET_MY_PROJECTS } from "@services/gql/query/GET_MY_PROJECTS";
import NoResult from "@components/common/NoResult";
import { useWindowSize } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";

export default function Participations() {
  const { t } = useTranslation();
  const size = useWindowSize();
  const limit_item = size.width < 960 ? 6 : 12;
  const [participations, setParticipations] = useState([]);
  const [page, setPage] = useState(0);

  const [getParticipations, { error, loading, data, fetchMore, refetch }] = useLazyQuery(
    GET_MY_PROJECTS,
    {
      variables: { state: "participations", limit: limit_item, page: 0 },
    }
  );

  useEffect(() => {
    if (!data && page === 0) getParticipations();
    if (data && page === 0) {
      setParticipations(data?.get_my_projects?.result);
      setPage(1);
    }
  }, [data, page]);

  const total = data?.get_my_projects?.total ?? 0;

  const fetchingMore = () => {
    if (!data) return;
    fetchMore({ variables: { page } })
      .then(({ data }) => {
        setParticipations([
          ...participations,
          ...(data?.get_my_projects?.result ? data.get_my_projects.result : null),
        ]);
        setPage(page + 1);
      })
      .catch((e) => console.log("error", e));
  };

  if (error) return <h5>{error.message}</h5>;
  if (loading) return <LoadingScreen />;

  return (
    <InfiniteScroll
      dataLength={participations?.length ?? 0}
      hasMore={limit_item * page < total}
      next={fetchingMore}
      style={{ overflow: "unset",marginTop:"20px" }}
    >
      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-x-4">
        {participations?.map((i, index) => (
          <div
            key={index}
            className="flex justify-center mb-5 w-full min-h-[280px] 400:min-h-[300px] 480:min-h-[340px]"
          >
            <ProjectCard
              data={i}
              refetch={refetch}
              isRequest={false}
              isPrivate={false}
              loadingHeight="h-[260px]"
              t={t}
              cardId={i._id}
              imgHeight="h-[180px] 400:h-[220px] 480:h-[240px]"
              imgUrl={i?.imgs && i?.imgs[0] ? i?.imgs[0] : null}
              openInNewTab={true}
            />
          </div>
        ))}
      </div>

      {participations?.length === 0 && <NoResult />}
    </InfiniteScroll>
  );
}
