import { useState, useEffect } from "react";
import ProjectCard from "@components/kit/card/project-card/Main";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLazyQuery } from "@apollo/client";
import { ASSOCIATION_GET_LICENSE_REQUEST_LIST } from "@services/gql/query/ASSOCIATION_GET_LICENSE_REQUEST_LIST";
import NoResult from "@components/common/NoResult";
import { useWindowSize } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import BelongingLicenseCard from "./BelongingLicenseCard";

export default function LicenseRequests() {
  const { t } = useTranslation();
  const size = useWindowSize();
  const limit_item = size.width < 960 ? 6 : 12;
  const [resut, setResult] = useState([]);
  const [page, setPage] = useState(0);

  const [getLicenseRequests, { error, loading, data, fetchMore, refetch }] = useLazyQuery(
    ASSOCIATION_GET_LICENSE_REQUEST_LIST,
    {
      variables: { limit: limit_item, page: 0 },
    }
  );

  useEffect(() => {
    if (!data && page === 0) getLicenseRequests();
    if (data && page === 0) {
      setResult(data?.association_get_license_requests_list?.result);
      setPage(1);
    }
  }, [data, page]);

  const total = data?.association_get_license_requests_list?.total ?? 0;

  const fetchingMore = () => {
    if (!data) return;
    fetchMore({ variables: { page } })
      .then(({ data }) => {
        setResult([
          ...resut,
          ...(data?.association_get_license_requests_list?.result
            ? data.association_get_license_requests_list.result
            : null),
        ]);
        setPage(page + 1);
      })
      .catch((e) => console.log("error", e));
  };

  if (error) return <h5>{error.message}</h5>;
  if (loading) return <LoadingScreen />;

  return (
    <InfiniteScroll
      dataLength={resut?.length ?? 0}
      hasMore={limit_item * page < total}
      next={fetchingMore}
      style={{ overflow: "unset" }}
    >
      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-x-4">
        {resut?.map((i, index) => (
          <div key={index} className="flex w-full border-b-[1px] border-gray6">
            <BelongingLicenseCard data={i} />
          </div>
        ))}
      </div>

      {resut?.length === 0 && <NoResult />}
    </InfiniteScroll>
  );
}
