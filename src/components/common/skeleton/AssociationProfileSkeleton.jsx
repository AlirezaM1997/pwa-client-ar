// COMPONENT
import Skeleton from "@components/kit/skeleton/Main";
import HorizontalCarousel from "../HorizontalCarousel";

export default function AssociationProfileSkeleton() {
  return (
    <>
      <header className="">
        <Skeleton className="pt-[18px] px-4 relative" height={115}>
          <Skeleton circle width={95} height={95} className="absolute top-[72px]" />
        </Skeleton>
        <div className="flex flex-col px-4 mt-[53px]">
          <div className="flex flex-row items-center gap-2 py-[14px]">
            <Skeleton width="15%" height={30} />
          </div>
          <div className="flex flex-row ">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} circle width={16} height={16} className="mx-0.5" />
            ))}
          </div>
          <div className="flex items-center mt-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`flex items-center ${item === 2 && "mx-[15px]"}`}
              >
                <Skeleton width={70} height={20} />
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="flex items-center gap-x-3 px-4 mt-[18px]">
        <Skeleton height={40} />
        <Skeleton height={40} />
      </div>

      <main className="pt-[33px] pb-[79px]">
        <HorizontalCarousel
          array={[1, 2, 3, 4, 5, 6, 7].map((i) => {
            return (
              <div key={i}>
                <Skeleton width={170} height={71} className="mb-2" />
                <Skeleton width={170} height={20} />
              </div>
            );
          })}
        />
        <div className="px-4 mt-[40px]">
          <Skeleton height={20} width={150} className="mb-1" />
          <Skeleton height={20} width={500} />
        </div>
        <div className="px-4 mt-[40px]">
          <Skeleton className="mb-2" width={250} height={20} />
        </div>
        <div className="flex flex-col px-4 gap-[24px] mt-[24px] mb-[21px]">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-[7px]">
              <Skeleton
                width={38}
                height={38}
                className="flex items-center justify-center rounded-lg shrink-0"
              />
              <div className="flex flex-col gap-0.5 shrink-0">
                <Skeleton width={500} height={19} />
                <Skeleton width={500} height={19} />
              </div>
            </div>
          ))}
        </div>
        <Skeleton height={150} className="px-4 showLocation " />
      </main>
    </>
  );
}
