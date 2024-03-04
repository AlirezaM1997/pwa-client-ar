import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
// GQL
import { ASSOCIATION_GET_NOTIFICATIONS } from "@services/gql/query/ASSOCIATION_GET_NOTIFICATIONS";
// COMPONENT
import NotifCard from "./NotifCard";
import NotificationSkeleton from "@components/common/skeleton/NotificationSkeleton";
// COMPONENT DYNAMIC IMPORT
const NoResult = dynamic(() => import("@components/common/NoResult"), { ssr: false });

const limit_item = 10;

export default function Notifications({ t }) {
  const [myNotifs, setMyNotifs] = useState([]);
  const [page, setPage] = useState(0);

  const [associationGetNotifications, { data, loading, error, fetchMore }] = useLazyQuery(
    ASSOCIATION_GET_NOTIFICATIONS,
    {
      fetchPolicy: "no-cache",
      variables: {
        page: 0,
        limit: limit_item,
      },
    }
  );

  useEffect(() => {
    if (!data && page === 0) associationGetNotifications();
    if (data && page === 0) {
      setMyNotifs(data.association_get_notifications.result);
      setPage(1);
    }
  }, [data]);

  const fetchingMore = () => {
    if (!data) return;
    fetchMore({ variables: { page } })
      .then(({ data }) => {
        setMyNotifs([...myNotifs, ...(data?.association_get_notifications.result || null)]);
        setPage(page + 1);
      })
      .catch((e) => console.log("error", e));
  };

  const total = data?.association_get_notifications.total ?? 20;

  if (loading) return [1, 2, 3, 4].map((item) => <NotificationSkeleton key={item} />);

  if (myNotifs.length === 0) return <NoResult />;

  return (
    <InfiniteScroll
      dataLength={myNotifs?.length ?? 0}
      hasMore={limit_item * page < total}
      next={fetchingMore}
      style={{ overflow: "unset" }}
    >
      {myNotifs.map((notif, index) => (
        <NotifCard t={t} notif={notif} classNames="mb-[20px]" key={"myNotifs" + index} />
      ))}
    </InfiniteScroll>
  );
}
