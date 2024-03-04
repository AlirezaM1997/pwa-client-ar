import Image from "next/legacy/image";
import { Verify } from "iconsax-react";
import { useRouter } from "next/router";

export default function SearchCard({ title, link, imgUrl, data }) {
  const router = useRouter();
  return (
    <>
      <div
        onClick={() => {
          router.push(link, undefined, { shallow: true });
          document.body.style.overflow = "unset";
        }}
      >
        <div className="flex items-center justify-center flex-col w-[150px] h-[141px] overflow-hidden">
          <div className="relative h-[102px] lg:h-[84px] w-full">
            <Image
              src={imgUrl ? imgUrl : "/assets/images/default-project-card-image.png"}
              layout="fill"
              alt={"default-image"}
              className="rounded-lg"
            ></Image>
          </div>

          <div className="flex flex-row items-center gap-1 mt-1 text-right ltr:text-left w-[85%] h-[36px]">
            <p className="caption4 text-gray1 textBelowImage">{title}</p>
            {/* below line is for associations cards */}
            {data?.verifyBadge && (
              <Verify size="14" color="#2889d7" variant="Bold" className="shrink-0" />
            )}
          </div>
        </div>
      </div>
      <style>{`
      .textBelowImage {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical
      }
    `}</style>
    </>
  );
}
