import { useWindowSize } from "@uidotdev/usehooks";
import Skeleton from "@components/kit/skeleton/Main";

export default function DepositSectionSkeleton() {
  const size = useWindowSize();

  return (
    <>
      <div className="lg:flex lg:flex-col lg:justify-between lg:h-full">
        <div className="px-4 lg:p-0">
          <Skeleton height={40} className="mb-2" />
          <Skeleton height={20} className="mb-[50px]" />
          <div className="relative">
            <Skeleton height={52} className="mb-[41px]" />
          </div>
          <div className="flex items-center justify-between lg:justify-center lg:gap-x-[30px]">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton
                key={item}
                height={48}
                width={95}
                className={`rounded-lg px-[6px] lg:px-[12px] py-1`}
              />
            ))}
          </div>
        </div>
        <div className="mt-[55px] lg:m-0 lg:flex lg:justify-end lg:w-full pb-9 px-4 lg:p-0">
          <Skeleton height={48} width={size.width < 960 ? "" : 180} />
        </div>
      </div>
    </>
  );
}
