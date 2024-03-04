import { useRouter } from "next/router";
import { CloseCircle } from "iconsax-react";

const Badge = ({ onClick, text }) => {
  return (
    <div
      className={`py-[7px] px-[13px] flex items-center gap-x-2 text-[11px] leading-[16px] font-normal rounded-lg border-[1px] border-gray5 bg-white ml-[5px]`}
    >
      <div className="cta1 whitespace-nowrap">{text}</div>
      <button onClick={onClick}>
        <CloseCircle size={16} />
      </button>
    </div>
  );
};

export default function MapFilterBadges({ t }) {
  const router = useRouter();

  return (
    <>
      {!router.query?.group || router.query?.group?.length == 0 ? null : (
        <Badge
          text={t("group")}
          onClick={() => {
            router.query.group = [];
            router.push(router, undefined, { shallow: true });
          }}
        />
      )}
      {!router.query?.status || router.query?.status?.length == 0 ? null : (
        <Badge
          text={t("statusHeader")}
          onClick={() => {
            router.query.status = [];
            router.push(router, undefined, { shallow: true });
          }}
        />
      )}
      {!router.query?.score || router.query?.score?.length == 0 ? null : (
        <Badge
          text={t("score")}
          onClick={() => {
            router.query.score = [];
            router.push(router, undefined, { shallow: true });
          }}
        />
      )}
      {!router.query?.requirements || router.query?.requirements?.length == 0 ? null : (
        <Badge
          text={t("requiredServices")}
          onClick={() => {
            router.query.requirements = [];
            router.push(router, undefined, { shallow: true });
          }}
        />
      )}
      {!router.query?.subjects || router.query?.subjects?.length == 0 ? null : (
        <Badge
          text={t("subject")}
          onClick={() => {
            router.query.subjects = [];
            router.push(router, undefined, { shallow: true });
          }}
        />
      )}
      {(!router.query?.minDate && !router.query?.maxDate) ||
      (router.query?.minDate?.length == 0 && router.query?.maxDate?.length == 0) ? null : (
        <Badge
          text={t("period")}
          onClick={() => {
            router.query.minDate = [];
            router.query.maxDate = [];
            router.push(router, undefined, { shallow: true });
          }}
        />
      )}
      {!router.query?.audience || router.query?.audience?.length == 0 ? null : (
        <Badge
          text={t("targetCommunity")}
          onClick={() => {
            router.query.audience = [];
            router.push(router, undefined, { shallow: true });
          }}
        />
      )}
    </>
  );
}
