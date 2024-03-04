import { getCookie } from "cookies-next";
import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useIsInViewport } from "@hooks/useIsInViewport";
// FUNCTION
import { getDate } from "@functions/getDate";
// GQL
import { ASSOCIATION_SEEN_NOTIFICATION } from "@services/gql/mutation/ASSOCIATION_SEEN_NOTIFICATION";

export default function NotifCard({ t, notif, classNames }) {
  const { createdAt, isSeen, message, _id } = notif;
  const lang = getCookie("NEXT_LOCALE");
  const [associationSeenNotification, { data, loading, error }] = useMutation(
    ASSOCIATION_SEEN_NOTIFICATION
  );
  const [isSeen_, setIsSeen] = useState(isSeen);
  const { ref, isInViewport } = !isSeen
    ? useIsInViewport()
    : { ref: useRef(null), isInViewport: false };

  useEffect(() => {
    !isSeen_ &&
      isInViewport &&
      !loading &&
      associationSeenNotification({
        variables: {
          notificationIds: [_id],
        },
      }).then(({ data }) => {
        if (data.association_seen_notification.status === 200) {
          setIsSeen(true);
        }
      });
  }, [isInViewport]);

  return (
    <div
      ref={ref}
      className={`w-full flex flex-col border border-gray5 rounded-lg text-black ${classNames}`}
    >
      <p className="pt-[14px] pb-[8px] lg:pt-[21px] lg:pb-[36px] px-[10px] caption5 leading-[24px] lg:text-[18px] lg:font-normal lg:leading-[30px]">
        {message}
      </p>
      <div className="flex flex-row justify-between bg-main8 caption3 lg:text-[14px] lg:font-normal lg:leading-[25px] px-[10px] py-1">
        <div className="flex flex-row gap-1">
          <span>{t("date")}.</span>
          <span>{getDate(createdAt, lang)}</span>
        </div>
      </div>
    </div>
  );
}
