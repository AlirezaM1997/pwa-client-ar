import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useMutation } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef, useMemo } from "react";
import { updateUnSeenCountAction } from "@store/slices/message";
// HOOK
import { Flag, InfoCircle, Send } from "iconsax-react";
import { useInitMessages } from "@hooks/useInitMessages";
import { useChatSubscription } from "@hooks/useChatSubscription";
// FUNCTION
import { getDate } from "@functions/getDate";
// GQL
import { MAKE_SEEN } from "@services/gql/mutation/MAKE_SEEN";
import { SEND_MESSAGE } from "@services/gql/mutation/SEND_MESSAGE";
// COMPONENT
import Header from "@components/common/Header";
import Loading from "@components/kit/loading/Loading";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import SquareBoxWithIcon from "@components/common/SquareBoxWithIcon";
import dynamic from "next/dynamic";
// COMPONENT DYNAMIC IMPORT
const ViolationReportBottomSheet = dynamic(
  () => import("@components/common/ViolationReportBottomSheet"),
  { ssr: false }
);
const CustomModal = dynamic(() => import("@components/kit/modal/CustomModal"), { ssr: false });

function newChatEvent(event) {
  const target = event?.currentTarget;
  target.scroll({ top: target.scrollHeight ?? 0 });
}
export default function SingeleConversation({ t, _id, _name, _chatRoomId }) {
  const size = useWindowSize();
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();
  const id = _id ? _id : router?.query?.id;
  const name = _name ? _name : router?.query?.name;
  const chatRoomId = _chatRoomId ? _chatRoomId : router?.query?.chatRoomId;
  const textRef = useRef(null);
  const [myMassage, setMyMassage] = useState("");
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const messageEl = useRef(null);
  const { isLoading } = useInitMessages();
  const [openErorrModal, setOpenErorrModal] = useState(false);
  const [failed, setFailed] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [make_seen] = useMutation(MAKE_SEEN);
  const dispatch = useDispatch();

  useChatSubscription(true);

  const { chats } = useSelector((state) => state.message);

  const messages = useMemo(() => {
    const msgs = chats?.find((item) => item.theOtherUser._id === id)?.messages ?? [];
    // change the sort
    return msgs.map((_, idx) => msgs[msgs.length - 1 - idx]);
  }, [chats, id]);

  useEffect(() => {
    if (messageEl.current) {
      messageEl?.current.addEventListener("DOMNodeInserted", newChatEvent);
    }
    // Cleanup the event
    return function () {
      if (messageEl.current) {
        messageEl.current?.removeEventListener("DOMNodeInserted", newChatEvent);
      }
    };
  }, [messageEl.current]);

  useEffect(() => {
    makeSeenMessages();
  }, []);

  useEffect(() => {
    setMyMassage("");
  }, [_id]);

  const onSendMassage = async () => {
    if (myMassage !== "") {
      const variables = {
        data: {
          to: id,
          text: myMassage,
        },
      };
      try {
        const {
          data: {
            sendMessage: { status },
          },
        } = await sendMessage({ variables });

        if (status == 200) {
          setMyMassage("");
          if (textRef) textRef.current.style.height = "22px";
        } else {
          setFailed(true);
          setOpenErorrModal(true);
        }
      } catch (error) {
        setFailed(true);
        setOpenErorrModal(true);
      }
    } else {
      setOpenErorrModal(true);
    }
  };

  const makeSeenMessages = async () => {
    try {
      const {
        data: { makeSeen },
      } = await make_seen({
        variables: {
          chatRoomId: chatRoomId,
        },
      });
      if (makeSeen.status === 200) {
        dispatch(updateUnSeenCountAction({ count: 0, _id: chatRoomId }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    if (size.width < 960) return <LoadingScreen />;
    else return <Loading />;
  }

  return (
    <>
      <section className="w-full lg:relative lg:h-full">
        <div className="lg:hidden">
          <Header onClick={() => history.back()} title={name} />
          <SquareBoxWithIcon
            size="32px"
            classNames="bg-gray6 rounded-full cursor-pointer absolute top-[23px] rtl:left-[16px] ltr:right-[16px]"
            onClick={() => {
              setOpenReport(true);
            }}
            icon={<Flag size="16" color="#7B808C" />}
          />
        </div>
        <div className="hidden bg-white absolute w-full z-10 shadow lg:flex items-center justify-between">
          <div className="flex items-center gap-x-[18px] justify-start  py-[9px] px-[6px] w-full">
            <div className="relative w-[44px] h-[44px] rounded-full ">
              <Image
                src={
                  chats.filter((item) => item.theOtherUser._id === id)[0]?.theOtherUser?.image ??
                  "/assets/images/default-user-image.png"
                }
                layout="fill"
                alt="profile-image"
                className="rounded-full p-2 cover-center-img"
                onError={(e) => {
                  e.target.src = "/assets/images/default-user-image.png";
                }}
              ></Image>
            </div>
            <p className="text-[18px] font-bold leading-[40px]">{_name}</p>
          </div>
          <div className="px-[6px]">
            <SquareBoxWithIcon
              size="32px"
              classNames="bg-gray6 rounded-full cursor-pointer"
              onClick={() => {
                setOpenReport(true);
              }}
              icon={<Flag size="16" color="#7B808C" />}
            />
          </div>
        </div>
        <div className="flex flex-col absolute top-0 right-0 left-0 bottom-0 w-full justify-between mt-[78px] lg:mt-0">
          <div
            className="chatDesktop flex flex-col-reverse px-4 overflow-auto mb-5 lg:mb-0 lg:bg-[#FAFAFA]"
            ref={messageEl}
          >
            {messages.map((item, index) => {
              return (
                <div
                  key={index * 2}
                  className={`flex ${item.isMe ? "justify-start" : "justify-end"}`}
                  dir="rtl"
                >
                  {item.isMe && (
                    <div className="block mt-2 whitespace-normal break-all">
                      <div
                        className=" inline-block  overflow-hidden rounded-[15px] rounded-br-[0px] rounde  bg-main7 outline-none py-[15px] px-[10px] text-[14px] font-normal leading-[22px] text-right"
                        style={{ wordBreak: "break-word" }}
                      >
                        <p className="caption2  text-black text-right whitespace-pre-line">
                          {item.text}
                        </p>
                      </div>
                      <p
                        className={`flex w-full caption3 text-gray4 px-1 ${
                          lang == "ar" ? "justify-start" : "justify-end"
                        }`}
                        dir={lang == "ar" ? "rtl" : "ltr"}
                      >
                        {getDate(item?.createdAt, lang, true)}
                      </p>
                    </div>
                  )}
                  {!item.isMe && (
                    <div className="block mt-2 whitespace-normal break-all" dir="ltr">
                      <div
                        className="inline-block overflow-hidden rounded-[15px] rounded-bl-[0px] rounde bg-gray6 outline-none py-[15px] px-[10px] text-[14px] font-normal leading-[22px] text-right"
                        style={{ wordBreak: "break-word" }}
                      >
                        <p className="caption2 text-black text-right whitespace-pre-line">
                          {item.text}
                        </p>
                      </div>
                      <p
                        className={`flex w-full ${
                          lang == "ar" ? "justify-end" : "justify-start"
                        } caption3 text-gray4 px-1`}
                        dir={lang == "ar" ? "rtl" : "ltr"}
                      >
                        {getDate(item?.createdAt, lang, true)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="bg-[#FFEBEB] w-full rounded-lg flex gap-x-3 py-[18px] px-[11px] mb-5 lg:mt-[80px]">
              <div className="w-6">
                <InfoCircle color="#E53535" size={24} />
              </div>
              <p className="text-[14px] leading-[28px] font-normal text-gray1">{t("chatHint")}</p>
            </div>
          </div>
          <div className="flex px-4 py-[15px] bg-white border-[#f1efef] rounded-lg lg:rounded-none border-t-2 shadow-inner">
            <div className="w-full flex-row flex justify-center items-end py-3 rounded-[28px] border-[1px] bg-gray6 border-gray5 outline-none px-[10px]">
              <textarea
                type="text"
                dir={lang == "ar" ? "ltr" : "rtl"}
                className="w-full text-[14px] outline-none font-normal py-0 rtl:pl-0 ltr:text-left ltr:pr-0 rtl:text-right mx-2 leading-[22px] max-h-[126px] h-[24px] bg-gray6 placeholder:text-gray4 border-none focus:outline-none focus:border-none focus:shadow-none"
                placeholder={t("sendMessage")}
                value={myMassage}
                rows={Math.ceil(myMassage.length / 40)}
                ref={textRef}
                onChange={(e) => {
                  setMyMassage(e.target.value.replace(/^\s+/, ""));
                  e.target.style.height = "22px";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                autoComplete="off"
                maxLength={1000}
              />
              <Send
                size="22"
                color="#ACACAF"
                variant="Bold"
                className="mx-2 rtl:rotate-180"
                onClick={() => onSendMassage()}
              />
            </div>
          </div>
        </div>
      </section>

      <CustomModal
        title={t("sendMessage")}
        description={failed ? t("massageNOtSend") : t("emptyMessage")}
        openState={openErorrModal}
        oneButtonOnClick={() => setOpenErorrModal(false)}
        hasOneButton={true}
        titleColor={"text-danger"}
        icon={
          <div className="flex items-center justify-center rounded-full bg-[#FFEBEB] w-[80px] h-[80px]">
            <InfoCircle color="#E53535" size={40} />
          </div>
        }
      />

      <ViolationReportBottomSheet
        lang={lang}
        t={t}
        setOpenViolationReportBottomSheet={setOpenReport}
        openViolationReportBottomSheet={openReport}
        targetType="CHATROOM"
        targetId={chatRoomId}
      />
    </>
  );
}
