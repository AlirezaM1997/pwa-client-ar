import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
// GQL
import { GET_BANNERS } from "@services/gql/query/GET_BANNERS";
// COMPONENT
import Skeleton from "@components/kit/skeleton/Main";

const css = `.responsive-slider {

  @media (min-width: 320px) {
    height: 150px !important;
  }
  @media (min-width: 360px) {
    height: 170px !important;
  }
  @media (min-width: 400px) {
    height: 200px !important;
  }
  @media (min-width: 480px) {
    height: 250px !important;
  }
  @media (min-width: 720px) {
    height: 380px !important;
  }
  @media (min-width: 960px) {
    height: 480px !important;
  }

}`;

export default function HeroSlider({ screenSize }) {
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_BANNERS, {
    variables: {
      position: ["v1"],
      screenSize,
      page: null,
      limit: null,
    },
  });

  if (data && data?.get_banners?.length === 0) return null;

  if (!data || loading || error) {
    return (
      <>
        <div className="relative">
          <div className="responsive-slider keen-slider">
            {[1].map((_, _index) => (
              <div
                key={_index}
                className="responsive-slider keen-slider__slide relative rounded-lg cursor-pointer transition duration-1000 ease-out "
              >
                <Skeleton height="100%" borderRadius={8} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <style>{css}</style>
      <div className="relative">
        <Swiper
          navigation={{ nextEl: ".arrow-left", prevEl: ".arrow-right" }}
          modules={[Pagination, Navigation]}
          className="mySwiper"
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
        >
          {data?.get_banners?.map((item, _index) => (
            <SwiperSlide
              key={_index}
              className="responsive-slider relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() => router.push(item.url, undefined, { shallow: true })}
            >
              <Image src={item.image} layout="fill" objectFit="fill" alt={"hero"} />
            </SwiperSlide>
          ))}
        </Swiper>

        <>
          <Arrow left className="arrow-left" />
          <Arrow className="arrow-right" />
        </>
      </div>
    </>
  );
}

function Arrow(props) {
  return (
    <div
      className={`${props.className} ${
        props.left ? "-left-2 md:right-[108px] md:left-[unset]" : "left-auto -right-2 md:right-6"
      } rounded-[5px] cursor-pointer bg-[#41444B] h-6 w-6 md:w-[50px] md:h-[50px] absolute top-1/2 md:bottom-[30px] md:top-[unset] -translate-y-1/2 flex items-center justify-center z-10`}
    >
      <svg
        className={`w-[12px] h-[22px]`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#EDEDED"
      >
        {props.left && (
          <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
        )}
        {!props.left && <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />}
      </svg>
    </div>
  );
}
