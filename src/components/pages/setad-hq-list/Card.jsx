import Link from "next/link";
import Image from "next/legacy/image";
import { getCookie } from "cookies-next";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

export default function Card({ isHq, cardId, name, imgUrl, openInNewTab }) {
  const lang = getCookie("NEXT_LOCALE");

  return (
    <>
      <Link
        href={isHq ? `/hq-profile/${cardId}` : `/setad-profile/${cardId}`}
        className="flex items-center justify-between"
        prefetch={false}
      >
        <div className="flex items-center gap-x-2">
          <div className="relative w-16 h-[47px] rounded-md overflow-hidden">
            <Image src={imgUrl} layout="fill" alt={"image"} className="cover-center-img" />
          </div>
          <h4 className="title1 whitespace-nowrap text-ellipsis break-words">
            {name?.slice(0, 40)}
          </h4>
        </div>
        {lang == "ar" ? <ArrowLeft2 size={16} /> : <ArrowRight2 size={16} />}
      </Link>
    </>
  );
}
