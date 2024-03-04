import { useWindowSize } from "@uidotdev/usehooks";
// COMPONENT
import Skeleton from "@components/kit/skeleton/Main";
import RequirementSlidesSkeleton from "./RequirementSlidesSkeleton";
import StatisticsTableSkeleton from "@components/common/skeleton/StatisticsTableSkeleton";
export default function ProjectProfileSkeleton() {
  const size = useWindowSize();
  return (
    <>
      <section className="pb-[100px] px-4 lg:max-w-[1320px] 2xl:m-auto">
        {size.width < 960 && (
          <div className="flex justify-between items-center py-[24px] relative ">
            <div className="flex items-center gap-x-[10px]">
              <>
                <Skeleton width={32} height={32} circle />
                <Skeleton width={31} height={31} circle />
              </>
            </div>
            <div className={`flex items-center gap-x-[10px] rtl:flex-row ltr:flex-row-reverse`}>
              {[1, 2, 3].map((item) => (
                <Skeleton width={31} height={31} circle key={item} />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:w-full lg:flex-row lg:mt-8 ">
          <div className="lg:w-[60%] relative lg:mb-[30px]">
            {size.width > 960 && (
              <div className={`absolute right-[14px] top[14px] z-50 mt-2`}>
                <div className="flex flex-row gap-x-2">
                  {[1, 2, 3].map((item) => (
                    <Skeleton width={31} height={31} circle key={item} />
                  ))}
                </div>
              </div>
            )}
            <>
              <Skeleton
                height="auto"
                className={` aspect-video ${
                  size.width > 700 ? "mb-2" : size.width > 960 ? "mb-2" : "mb-2"
                }`}
              ></Skeleton>
              <Skeleton
                className={`${size.width > 700 ? "mb-2" : size.width > 960 ? "mb-2" : "mb-2"}`}
              ></Skeleton>
            </>
          </div>

          <div className="mb-[28px] mt-[20px] lg:mt-0 lg:w-[40%] lg:ltr:ml-[40px] lg:rtl:mr-[40px] ">
            <Skeleton height={35} />
            <div className="flex flex-row mt-2 gap-1 lg:pt-3">
              <Skeleton height={35} />
            </div>
            {size.width > 960 && (
              <div className="mb-[22px]">
                <h1 className="mb-[21px] lg:pt-9">
                  <Skeleton height={35} />
                </h1>
                <div className="flex flex-col mb-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex flex-row flex-wrap items-center mb-1">
                      <div className="flex flex-1">
                        <Skeleton height={22} width={20} className="ml-1" />
                        <Skeleton height={22} width="100%" />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <Skeleton height={60} />
                </div>
                <div className="mt-4">
                  <Skeleton height={40} />
                </div>
              </div>
            )}
          </div>
        </div>
        <RequirementSlidesSkeleton />
        {size.width < 960 && (
          <div className="mb-[22px] mt-[30px]">
            <div className="flex flex-col">
              {[1, 2, 3, 4, 5].map((item) => (
                <>
                  <div key={item} className="flex flex-row flex-wrap items-center mb-1">
                    <div className="flex flex-1">
                      <Skeleton height={22} width={20} className="ml-1" />
                      <Skeleton height={22} width="100%" />
                    </div>
                  </div>
                </>
              ))}
            </div>
            <div className="flex flex-row flex-wrap items-center mb-1">
              <div className="flex flex-1 items-center">
                <Skeleton height={80} width="100%" />
              </div>
            </div>
          </div>
        )}

        <Skeleton width="100%" height={204} className="mt-[30px] mb-[50px]" />
        <StatisticsTableSkeleton classNames="mt-[34px] mx-[4px]" />

        <div className="mt-[40px]">
          <div className="mb-[40px] flex justify-center">
            <Skeleton width="30%" height={50} />
          </div>
          <div className="bg-white p-[10px] border border-gray5 pb-[16px] border-b-[1.5px]">
            <Skeleton classNames="mb-[44px]" height={167} />
            <div className="flex justify-end py-[8px] px-[7px] border-t-[1.5px] border-gray6">
              <Skeleton width={98} height={40} className="rounded-[10px]" />
            </div>
          </div>

          <div className="mt-[44px] mb-[33px] flex justify-center">
            <Skeleton width="30%" height={50} />
          </div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                className="bg-white p-[10px] border border-gray5 pb-[16px] border-b-[1.5px]"
                key={i}
              >
                <Skeleton className="mb-1" />
                <Skeleton height={35} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {size.width < 960 && (
        <div
          className="flex justify-center items-center sticky bottom-0 z-10 h-[63px] px-4 py-3"
          style={{ background: "#FFFFFF", boxShadow: "0 -4px 4px rgba(228, 228, 228, 0.25)" }}
        >
          <Skeleton className="block w-[100%] h-[100%]" height={40} />
        </div>
      )}
    </>
  );
}
