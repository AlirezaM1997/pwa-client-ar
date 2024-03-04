import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import InfiniteScroll from "react-infinite-scroll-component";
// GQL
import { GET_PROJECTS } from "@services/gql/query/GET_PROJECTS";
// COMPONENT
import Loading from "@components/kit/loading/Loading";
import ProjectCard from "@components/kit/card/project-card/Main";
// COMPONENT DYNAMIC IMPORT
const NoResult = dynamic(() => import("@components/common/NoResult"), { ssr: false });


export default function AssociationProjects({ t }) {
  const size = useWindowSize();
  const limit_item = size.width < 960 ? 6 : 12;
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const {
    query: { id: associationID },
  } = useRouter();

  const [getProjects, { loading, error, data, fetchMore, refetch }] = useLazyQuery(GET_PROJECTS, {
    variables: {
      page: 0,
      limit: limit_item,
      filters: {
        associationId: associationID,
      },
    },
  });

  useEffect(() => {
    if (!data && page === 0) getProjects();
    if (data && page === 0) {
      setProjects(data?.get_projects?.result);
      setPage(1);
    }
  }, [data, page]);

  const total = data?.get_projects?.total ?? 0;

  const fetchingMore = () => {
    if (!data) return;
    fetchMore({ variables: { page } })
      .then(({ data }) => {
        setProjects([
          ...projects,
          ...(data?.get_projects?.result ? data.get_projects.result : null),
        ]);
        setPage(page + 1);
      })
      .catch((e) => console.log("error", e));
  };

  if (error) return <h5>{error.message}</h5>;

  return (
    <>
      {!data && loading ? (
        <div className="fixed">
          <Loading
            loadingHeight={size.width < 1320 ? `${size.height - 220}px` : `${size.height - 195}px`}
            loadingWidth={size.width < 1320 ? "w-screen" : "w-[1320px]"}
          />
        </div>
      ) : (
        <InfiniteScroll
          dataLength={projects?.length ?? 0}
          hasMore={limit_item * page < total}
          next={fetchingMore}
          style={{ marginTop: "20px", overflow: "unset" }}
        >
          <div className="md:grid md:grid-cols-2 xl:grid-cols-3">
            {projects?.map((i, index) => (
              <div
                key={"AssociationProjects" + index}
                className="px-4 flex justify-center mb-5 w-full min-h-[280px] 400:min-h-[300px] 480:min-h-[330px]"
              >
                <ProjectCard
                  data={i}
                  refetch={refetch}
                  isRequest={false}
                  t={t}
                  cardId={i._id}
                  isPrivate={false}
                  loadingHeight="h-[260px]"
                  imgUrl={i?.imgs?.[0] || null}
                  imgHeight="h-[180px] 400:h-[220px] 480:h-[240px]"
                  openInNewTab={true}
                />
              </div>
            ))}
          </div>
          {projects?.length === 0 && <NoResult />}
        </InfiniteScroll>
      )}
    </>
  );
}
