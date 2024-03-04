import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
// FUNCTION
import { getDate } from "@functions/getDate";

export const ChatCard = ({ data, setChatData, chatData }) => {
  const [isNewMessageClicked, setIsNewMessageClicked] = useState(false);
  const lastText = data?.messages[data?.messages?.length - 1]?.text ?? "";
  const lastTextDate = data?.messages[data?.messages?.length - 1]?.createdAt ?? "";
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();
  const size = useWindowSize();

  useEffect(() => {
    if (isNewMessageClicked) {
      setIsNewMessageClicked(false);
    }
  }, [data]);

  const handelOnClick = () => {
    setIsNewMessageClicked(true);
    if (size.width < 960) {
      router.push(
        {
          pathname: `/messages/${data?.theOtherUser?._id}`,
          query: { name: data?.theOtherUser?.name, chatRoomId: data?._id },
        },
        undefined,
        { shallow: true }
      );
    } else {
      setChatData({
        id: data?.theOtherUser?._id,
        name: data?.theOtherUser?.name,
        chatRoomId: data?._id,
      });
    }
  };

  return (
    <section
      onClick={() => handelOnClick()}
      className={`${
        chatData?.id === data?.theOtherUser?._id ? "bg-gray5" : ""
      } flex w-full border-b-[1px] border-gray6 rounded-lg lg:rounded-none py-4 px-3 cursor-pointer lg:gap-x-4 lg:grid lg:grid-cols-[50px_auto]`}
    >
      <div className=" relative w-[60px] h-[50px] lg:w-[50px] lg:h-[50px] rounded-full ">
        <Image
          src={data?.theOtherUser?.image ?? "/assets/images/default-user-image.png"}
          layout="fill"
          alt="profile-image"
          className="rounded-full p-2 lg:p-0 cover-center-img"
          onError={(e) => {
            e.target.src = "/assets/images/default-user-image.png";
          }}
        ></Image>
      </div>
      <div className=" w-full px-4 lg:px-0">
        <div className="flex flex-row-reverse justify-between items-center ">
          <p className="caption3 lg:caption1 lg:leading-[32px] text-gray4">
            {getDate(lastTextDate, lang)}
          </p>
          <div className="flex flex-row-reverse overflow-hidden">
            <div className="block lg:hidden">
              {data?.unseenCount !== 0 && (
                <p className=" flex justify-center items-center mx-2 h-[17px] font-bold w-[17px] pt-[1px] bg-main2 text-white rounded-[18px] text-[10px]">
                  {data?.unseenCount}
                </p>
              )}
            </div>

            <p className="title1 text-black lg:text-[18px] lg:font-bold lg:leading-[32px] lg:max-w-[300px] lg:whitespace-nowrap lg:overflow-hidden lg:text-ellipsis">
              {data?.theOtherUser?.name ?? ""}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="cta2 text-gray2 lg:text-[16px] lg:font-normal lg:leading-[25px] mt-1 lg:mt-0 mb-[9px] lg:mb-0">
            {lastText.slice(0, 38)}
          </p>
          <div className="hidden lg:block">
            {/* {data?.unseenCount !== 0 && (
              <p className=" flex justify-center items-center mx-2 h-[17px] font-bold w-[17px] pt-[1px] bg-main2 text-white rounded-[18px] text-[10px]">
                {data?.unseenCount}n 
              </p>
            )} */}
            {/* Unseen message count */}
            {data?.unseenCount > 0 && (
              <p
                className={`flex justify-center items-center mx-2 h-[17px] font-bold w-[17px] pt-[1px] bg-main2 text-white rounded-[18px] text-[10px] ${
                  isNewMessageClicked ? "bg-blue" : ""
                }`}
              >
                {data?.unseenCount}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
