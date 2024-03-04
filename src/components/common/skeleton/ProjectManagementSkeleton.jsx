import HeaderSkeleton from "./HeaderSkeleton";
import Skeleton from "@components/kit/skeleton/Main";
import ProjectStatusSkeleton from "./ProjectStatusSkeleton";

function ProjectManagementSkeleton() {
  return (
    <>
      <HeaderSkeleton />
      <main className="pt-[7px] pb-[80px] max-w-[1320px] 2xl:mx-auto">
        <div className="h-[61px] lg:h-[74px] px-4 bg-gray6 flex gap-x-2 lg:gap-x-3 items-center mb-5 lg:mb-9 lg:mx-6">
          <div className=" relative w-12 lg:w-14 h-12 lg:h-14 rounded-[8px] overflow-hidden">
            <Skeleton className="rounded-[8px] cover-center-img"></Skeleton>
          </div>
          <Skeleton height={36} />
        </div>
        <div className="lg:border-gary5 lg:border-[2px] lg:rounded-[14px]  lg:py-4 lg:m-6 lg:mt-0">
          <div className="px-4 pb-[10px] lg:px-6">
            <ProjectStatusSkeleton />
          </div>
          <div className="border-t-[10px] border-gray6 lg:border-t-[2px] lg:px-2 pt-4">
            <div className="px-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="py-2 border-b-[1px]">
                  <Skeleton height={41} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:gap-4">
          {[1, 2, 3].map((item) => (
            <div
              className="border-t-[10px] border-gray6 pt-4 lg:border-gray5 lg:border-[2px] lg:rounded-[14px] lg:m-6"
              key={item}
            >
              <div className="px-4 lg:border-gray5 lg:border-b-[2px] lg:pb-7 lg:pt-3 lg:px-6">
                <Skeleton height={50} />
              </div>
              <div className="flex items-center justify-between px-4 pt-5 lg:px-4 ">
                <Skeleton height={20} width="75%" className="ml-1" />
                <Skeleton height={20} width="25%" />
              </div>
              <div className="px-1 my-1 lg:px-3 pr-[4%]">
                <Skeleton height={344} />
              </div>
              <div className="px-1 my-1 lg:px-3 pr-[4%] flex justify-center">
                <Skeleton height={36} width="84%" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default ProjectManagementSkeleton;
