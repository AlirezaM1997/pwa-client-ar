import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import InfiniteScroll from "react-infinite-scroll-component";
// GQL
import { GET_BOOKMARKED_PROJECTS } from "@services/gql/query/GET_BOOKMARKED_PROJECTS";
// COMPONENT
import ProjectCard from "@components/kit/card/project-card/Main";
import ProjectCardSkeleton from "@components/kit/card/project-card-skeleton/Main";
// COMPONENT
const NoResult = dynamic(() => import("@components/common/NoResult"), { ssr: false });

export default function Projects({ t, search }) {
  const size = useWindowSize();
  const limit_item = size.width < 960 ? 6 : 12;
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);

  const [getProjects, { error, loading, data, fetchMore, refetch }] = useLazyQuery(
    GET_BOOKMARKED_PROJECTS,
    {
      variables: { limit: limit_item, page: 0, filters: { search: "" } },
      fetchPolicy: "no-cache",
    }
  );

  const total = data?.get_bookmarked_projects?.total ?? 0;

  useEffect(() => {
    if (!data && page === 0 && search.length === 0) getProjects();
    if (data && page === 0) {
      setProjects(data?.get_bookmarked_projects?.result);
      setPage(1);
    }
  }, [data, search, page]);

  useEffect(() => {
    if (search.length > 0) {
      setPage(0);
      getProjects({ variables: { limit: limit_item, page: 0, filters: { search } } });
    } else {
      setPage(0);
      getProjects();
    }
  }, [search]);

  const fetchingMore = () => {
    if (!data) return;
    fetchMore({ variables: { page } })
      .then(({ data }) => {
        setProjects([...projects, ...(data?.get_bookmarked_projects?.result ?? null)]);
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
              isRequest={false}
              imgHeight="h-[180px] 400:h-[220px] 480:h-[240px]"
            />
          </div>
        ))}
      </div>
    );

  return (
    <InfiniteScroll
      dataLength={projects?.length ?? 0}
      hasMore={limit_item * page < total}
      next={fetchingMore}
      style={{ overflow: "unset" }}
    >
      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-x-4">
        {projects?.map((i, index) => (
          <div
            key={index}
            className="flex justify-center mb-5 w-full min-h-[280px] 400:min-h-[300px] 480:min-h-[340px]"
          >
            <ProjectCard
              data={i}
              isRequest={false}
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
      {projects?.length === 0 && <NoResult />}
    </InfiniteScroll>
  );
}
