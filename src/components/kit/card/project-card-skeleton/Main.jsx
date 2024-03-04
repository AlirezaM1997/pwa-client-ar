import React from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import Skeleton from "@components/kit/skeleton/Main";

function ProjectCardSkeleton({
  isRequest = true,
  imgHeight = "h-[180px]",
  searchPage,
  favorite = false,
}) {
  const size = useWindowSize();
  if (searchPage)
    return (
      <div className={`flex justify-center ${favorite ? "" : "px-4"} w-full`}>
        <div className="flex flex-col p-3 justify-center items-center border-gray5 border-2 rounded-2xl w-full mb-[20px]">
          <div
            className={`relative ${imgHeight} w-full rounded-[16px] mb-1 ${
              size.width < 480 && "mb-6"
            }`}
          >
            <Skeleton
              height={size.width < 400 ? 220 : 240}
              className="rounded-[16px]"
              borderRadius={16}
            />
          </div>
          <Skeleton
            height={15}
            width="98%"
            className="flex items-center justify-between gap-x-[7px] mt-[10px]"
          />
          {!isRequest && (
            <>
              <Skeleton height={29} width="98%" className="flex items-center mt-[8px]" />
              <Skeleton height={36} width="98%" className="flex items-center mt-[8px]" />
            </>
          )}
        </div>
      </div>
    );
  return (
    <div className="w-[314px]">
      <div
        className={`flex flex-col p-3 justify-center items-center cursor-pointer border-gray5 border-2 rounded-2xl w-full`}
      >
        <Skeleton height={180} borderRadius={16} className="m-[2px]" />
        <Skeleton height={16.5} borderRadius={12} />
        {isRequest && (
          <>
            <Skeleton height={45} borderRadius={12} className="m-[2px]" />
            <Skeleton height={36} borderRadius={8} />
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectCardSkeleton;
