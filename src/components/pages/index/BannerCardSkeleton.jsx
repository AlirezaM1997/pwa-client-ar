import React from "react";
// COMPONENT
import Skeleton from "@components/kit/skeleton/Main";

function BannerCardSkeleton() {
  return (
    <div className=" cursor-pointer">
      <div className="rounded-[8px] w-[315px] h-[110px]  400:w-[365px] 400:h-[130px] 480:w-[440px] 480:h-[160px] overflow-hidden">
        <div className="relative w-[315px] h-[110px]  400:w-[365px] 400:h-[130px] 480:w-[440px] 480:h-[160px] ">
          <Skeleton height="100%" />
        </div>
      </div>
    </div>
  );
}

export default BannerCardSkeleton;
