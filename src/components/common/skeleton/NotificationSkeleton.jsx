import Skeleton from "@components/kit/skeleton/Main";

function NotificationSkeleton() {
  return (
    <div className="w-full flex flex-col border border-gray5 rounded-lg">
      <div className="pt-[14px] pb-[8px] lg:pt-[21px] lg:pb-[36px] px-[10px]">
        <Skeleton height={50} />
      </div>
      <div className=" px-[10px] py-1">
        <Skeleton className="flex flex-row gap-1" height={35} />
      </div>
    </div>
  );
}

export default NotificationSkeleton;
