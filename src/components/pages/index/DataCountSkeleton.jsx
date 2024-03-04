import React from "react";
import { useWindowSize } from "@uidotdev/usehooks";
// COMPONENT
import Skeleton from "@components/kit/skeleton/Main";

function DataCountSkeleton() {
  const windowSize = useWindowSize();
  const isLargeScreen = windowSize.width > 960;
  const circleSize = isLargeScreen ? 36 : 32;
  const labelWidth = isLargeScreen ? 126 : 32;

  return (
    <div className={`flex items-center lg:items-start gap-x-[18px] mb-[25px] lg:mb-0`}>
      <Skeleton circle width={circleSize} height={circleSize} />
      <div>
        <div className="mb-[4px]">
          <Skeleton width={labelWidth} height={isLargeScreen ? 16 : 32} />
        </div>
        <div>
          <Skeleton width={labelWidth} height={isLargeScreen ? 16 : 32} />
        </div>
      </div>
    </div>
  );
}

export default DataCountSkeleton;
