import { ChatCard } from "./ChatCard";
import { NoMessageCard } from "@components/pages/messages/chats/NoMessageCard";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useSelector } from "react-redux";
import Image from "next/legacy/image";
import { useEffect, useRef, useState } from "react";
// COMPONENT
import SingeleConversation from "./SingeleConversation";
import dynamic from "next/dynamic";
// COMPONENT DYNAMIC IMPORT
const NoResult = dynamic(() => import("@components/common/NoResult"), { ssr: false });

export default function Chats({ t }) {
  const router = useRouter();
  const chats = useSelector((state) => state.message.chats);
  const [chatData, setChatData] = useState(null);
  const lang = getCookie("NEXT_LOCALE");
  const ref = useRef(null);

  useEffect(() => {
    if (router.query) {
      setChatData({
        id: router.query?.id,
        chatRoomId: router.query?.chatRoomId,
        name: router.query?.name,
      });
    }
  }, [router.query]);

  useEffect(() => {
    ref.current?.scroll({ top: 0 });
  }, [chats]);

  return (
    <>
      <div className="block lg:hidden">
        {chats.length !== 0 ? (
          chats.map((item, index) => (
            <div key={index}>
              <ChatCard data={item} />
            </div>
          ))
        ) : (
          <NoResult />
        )}
      </div>
      <div className="hidden lg:block">
        {chats.length !== 0 || chatData?.id ? (
          <div className="border-[1px] lg:rounded-md">
            <div className="flex">
              <section
                ref={ref}
                className="chatDesktop w-[35%] border-r-[1px] h-[650px] overflow-y-auto overflow-x-hidden"
              >
                {chats.length !== 0 ? (
                  chats.map((item, index) => (
                    <div key={index}>
                      <ChatCard data={item} setChatData={setChatData} chatData={chatData} />
                    </div>
                  ))
                ) : (
                  <NoMessageCard t={t} />
                )}
              </section>
              <section className=" w-[65%] h-[650px]">
                {chatData?.id ? (
                  <SingeleConversation
                    t={t}
                    _id={chatData?.id}
                    _chatRoomId={chatData?.chatRoomId}
                    _name={chatData?.name}
                  />
                ) : (
                  <div className=" w-[65%] h-[650px] flex flex-col gap-y-4 justify-center items-center mx-auto">
                    <div className="relative w-[220px] h-[70px]">
                      <Image
                        alt="logo"
                        src={
                          lang == "ar"
                            ? "/assets/images/logo-mofid-fa.png"
                            : "/assets/images/logo-mofid.png"
                        }
                        layout="fill"
                      />
                    </div>

                    <h1 className="heading">{t("chatStart")}</h1>
                  </div>
                )}
              </section>
            </div>
          </div>
        ) : (
          <NoResult />
        )}
      </div>
    </>
  );
}
