import "swiper/css";
import { useWindowSize } from "@uidotdev/usehooks";
import { Swiper, SwiperSlide } from "swiper/react";
// COMPONENT
import Skeleton from "@components/kit/skeleton/Main";

export default function RequirementSlidesSkeleton({ financial = true }) {
  const size = useWindowSize()
  return (
    <div>
      {financial && <Skeleton height={120} width={size.width > 960 && "58%" }  />}
      <div className="mt-2 lg:mt-4">
        <Swiper slidesPerView="auto" spaceBetween={7}>
          {[1, 2, 3, 4, 5].map(
            (item, i) =>
              item.type !== "FINANCIAL" && (
                <>
                  <SwiperSlide
                    key={item.type + i}
                    className=" !w-[170px] !h-[170px] lg:!w-[265px] lg:!h-[170px]"
                  >
                    <Skeleton className="!w-[170px] !h-[170px] lg:!w-[265px] lg:!h-[170px]" />
                  </SwiperSlide>
                </>
              )
          )}
        </Swiper>
      </div>
    </div>
  );
}
