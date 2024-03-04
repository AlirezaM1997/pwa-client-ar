import Skeleton from "@components/kit/skeleton/Main";
import { useWindowSize } from "@uidotdev/usehooks";
import React from "react";

function HeaderSkeleton({ hasBackButton = false, width }) {
  const size = useWindowSize();
  return (
    <header className={`w-full flex z-20 lg:my-[43px] h-[46px] ${size.width < 960 && "top-2"}`}>
      {hasBackButton && (
        <div className="px-4 lg:px-[30px] z-10 flex items-center justify-between">
          <Skeleton width={size.width > 960 ? 36 : 32} height={size.width > 960 ? 36 : 32} circle />
        </div>
      )}
      <Skeleton
        width={width ? width : "20%"}
        height={40}
        className="left-1/2 translate-x-[-50%] w-max items-center absolute"
      />
    </header>
  );
}

export default HeaderSkeleton;
