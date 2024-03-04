import React from "react";
// COMPONENT
import Skeleton from "@components/kit/skeleton/Main";

function HeroSliderSkeleton() {
  const getSliderHeight = () => {
    // Define your responsive height on screen size
    const screenWidth = window.innerWidth;
    if (screenWidth < 320) {
      return "150px";
    } else if (screenWidth < 360) {
      return "170px";
    } else if (screenWidth < 400) {
      return "200px";
    } else if (screenWidth < 480) {
      return "250px";
    } else if (screenWidth < 720) {
      return "320px";
    } else if (screenWidth > 960) {
      return "480px";
    }
  };

  return (
    <div className="relative px-4 lg:px-0 overflow-hidden w-full">
      {[1].map((item, _index) => (
        <Skeleton key={_index} height={getSliderHeight()} borderRadius={16} />
      ))}
    </div>
  );
}

export default HeroSliderSkeleton;
