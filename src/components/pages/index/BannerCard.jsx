import Image from "next/legacy/image";
import { useRouter } from "next/router";

export default function BannerCard({ imageUrl, link }) {
  const router = useRouter();
  return (
    <>
      <div
        className=" cursor-pointer"
        onClick={() => router.push(link, undefined, { shallow: true })}
      >
        <div className="rounded-[8px] w-[315px] h-[110px]  400:w-[365px] 400:h-[130px] 480:w-[440px] 480:h-[160px] overflow-hidden">
          <div className="relative w-[315px] h-[110px]  400:w-[365px] 400:h-[130px] 480:w-[440px] 480:h-[160px] ">
            <Image src={imageUrl} layout="fill" alt={"img"}></Image>
          </div>
        </div>
      </div>
    </>
  );
}
