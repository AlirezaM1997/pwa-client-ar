import Image from "next/legacy/image";
import { YellowStar } from "@lib/svg";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
// GQL
import { FOLLOW_ASSOCIATION } from "@services/gql/mutation/FOLLOW_ASSOCIATION";
// COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

export default function FollowCard({ data, t, refetchCall }) {
  const router = useRouter();
  const [follow] = useMutation(FOLLOW_ASSOCIATION);

  const handleFollow = async () => {
    try {
      const {
        data: { follow_association },
      } = await follow({
        variables: {
          associationId: data?._id,
        },
      });
      if (follow_association.status === 200) refetchCall();
    } catch (error) {
      console.error(error);
      if (error.message === "Authorization failed" || error.message === "Token required")
        router.push("/login", undefined, { shallow: true });
    }
  };

  const handleOnClick = () => {
    if (data?.role === "association")
      router.push(`/association-profile/${data._id}`, undefined, { shallow: true });
  };

  return (
    <div
      className={`flex items-center justify-between ${
        data?.role === "association" ? "cursor-pointer" : ""
      }`}
      onClick={handleOnClick}
    >
      <div className="flex gap-x-[10px] w-full  items-center">
        <div className="relative h-[55px] w-[55px]  ">
          <Image
            src={data.image ? data.image : "/assets/images/default-association-image.png"}
            layout="fill"
            alt={"association-image"}
            className="rounded-full cover-center-img"
          ></Image>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-1">
            <p className="title1 whitespace-nowrap overflow-hidden text-ellipsis my-1">
              {data.name}
            </p>
          </div>
          {data?.averageScore > 0 && (
            <div className="flex gap-x-1 items-center">
              <YellowStar w={14} h={13} />
              <p className="title2 text-gray1 ">{data?.averageScore}</p>
            </div>
          )}
        </div>
      </div>
      {data?.role === "association" && (
        <div onClick={(e) => e.stopPropagation()}>
          <CustomButton
            title={data?.haveIfollowed ? t("unfollow") : t("follow")}
            width="w-[84px]"
            styleType={data?.haveIfollowed ? "Primary" : "Secondary"}
            textColor={data?.haveIfollowed ? "text-[#FFFFFF]" : "text-main2"}
            onClick={handleFollow}
          />
        </div>
      )}
    </div>
  );
}
