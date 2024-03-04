import { YellowStar } from "@lib/svg";
import Image from "next/legacy/image";
import { Verify } from "iconsax-react";
import { useRouter } from "next/router";

export default function AssociationCard({ data, openInNewTab = false }) {
  const router = useRouter();

  const onClickCardHandle = () => {
    if (openInNewTab) {
      const newWindow = window.open(
        `/association-profile/${data?._id}`,
        "_blank",
        "noopener,noreferrer"
      );
      if (newWindow) newWindow.opener = null;
    } else {
      router.push(`/association-profile/${data?._id}`, undefined, { shallow: true });
    }
  };

  return (
    <div
      onClick={() => onClickCardHandle()}
      className="flex flex-row py-[26px] w-full border-b-[1px] border-gray5 items-center"
    >
      <div className="relative h-[66px] w-[66px]  ">
        <Image
          src={data.image ? data.image : "/assets/images/default-association-image.png"}
          layout="fill"
          alt={"association-image"}
          className="rounded-full cover-center-img"
        ></Image>
      </div>
      <div className="flex flex-col mx-3">
        <div className="flex flex-row items-center gap-1">
          <p className="text-[12px] text-black font-bold whitespace-nowrap overflow-hidden text-ellipsis my-1">
            {data.name}
          </p>
          {data?.verifyBadge && (
            <Verify size="14" color="#2889d7" variant="Bold" className="shrink-0" />
          )}
        </div>
        {data?.averageScore > 0 && (
          <div className="flex gap-x-1 items-center">
            <YellowStar w={12} h={11.5} />
            <p className="text-[10px] text-gray1 font-medium whitespace-nowrap overflow-hidden text-ellipsis ">
              {data?.averageScore}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
