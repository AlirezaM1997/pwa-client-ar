import Head from "next/head";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useWindowSize } from "@uidotdev/usehooks";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//HOOK
import { useInitMessages } from "@hooks/useInitMessages";
import { useChatSubscription } from "@hooks/useChatSubscription";
//COMPONENT
import Header from "@components/common/Header";
import Login from "@components/common/login/Main";
import Chats from "@components/pages/messages/chats/Main";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import Skeleton from "@components/kit/skeleton/Main";
// COMPONENT DYNAMIC IMPORT
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });
const Notifications = dynamic(() => import("@components/pages/messages/notifications/Main"), {
  ssr: false,
});

export default function MessagesPage() {
  const { t } = useTranslation();
  const size = useWindowSize();
  const router = useRouter();
  const [chatShow, setChatShow] = useState(true);
  const [notifsShow, setNotifsShow] = useState(false);
  const { isLoading } = useInitMessages();
  const token = useSelector((state) => state.token.token);

  const flag = size.width < 960;
  // this flag is for prevent extra calling the below hook in desktop mode!
  useChatSubscription(flag);

  if (!token)
    return (
      <ModalScreen open={true}>
        <Login setShowLogin={true} t={t} landingRoute="messages" />
      </ModalScreen>
    );

  if (isLoading)
    return (
      <section className="w-full pb-[63px] lg:pb-2 max-w-[1320px] 2xl:mx-auto">
        <div className="w-full px-4 pt-[12px] lg:pt-[32px]  grid grid-cols-2 gap-[2px]">
          <Skeleton height={50} className="pb-[13px] lg:pb-[23px] " />
          <Skeleton height={50} />
        </div>
      </section>
    );

  return (
    <>
      <Head>
        <title>{t("inbox")}</title>
      </Head>
      <section className="w-full pb-[63px] lg:pb-2 max-w-[1320px] 2xl:mx-auto">
        {size.width < 960 && <Header onClick={() => router.back()} title={t("inbox")} />}
        <div className="w-full px-4 pt-[12px] lg:pt-[32px] bg-white grid grid-cols-2">
          <button
            className={`${
              chatShow ? "border-b-[2px] border-main2 text-main2 title1" : "text-black caption1"
            } pb-[13px] lg:pb-[23px] h-[34px] lg:h-[50px] lg:text-[22px] lg:font-bold lg:leading-[40px]`}
            onClick={() => {
              setChatShow(true);
              setNotifsShow(false);
            }}
          >
            {t("chat")}
          </button>
          <button
            className={`${
              notifsShow ? "border-b-[2px] border-main2 text-main2 title1" : "text-black caption1 "
            } pb-[13px] lg:pb-[23px] h-[34px] lg:h-[50px] lg:text-[22px] lg:font-bold lg:leading-[40px]`}
            onClick={() => {
              setChatShow(false);
              setNotifsShow(true);
            }}
          >
            {t("notifications.notifications")}
          </button>
        </div>

        <div className="px-4 mt-[29px]">
          {notifsShow && <Notifications t={t} />}
          {chatShow && <Chats t={t} />}
        </div>
      </section>
    </>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
