import Link from "next/link";
import { Plus } from "@lib/svg";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Home, LoginCurve, Map1, Message, MessageNotif, Profile } from "iconsax-react";
// GQL
import { GET_MY_CHAT } from "@services/gql/query/GET_MY_CHAT";

export default function FooterMenu() {
  const router = useRouter();
  const currentUserId = useSelector((state) => state.token._id);
  const { t } = useTranslation();

  const { data } = useQuery(GET_MY_CHAT);

  const MessageComponent = () => {
    const chatRooms = data?.get_my_chat || [];

    const totalUnseenCount = chatRooms.reduce(
      (chatCount, chatRoom) => chatCount + (chatRoom.unseenCount || 0),
      0
    );

    const [totalCount, setTotalCount] = useState(0);
    const [showBlueDot, setShowBlueDot] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setTotalCount((prevCount) => prevCount + 1);
        setShowBlueDot(true);
      }, 2000);

      return () => clearTimeout(timer);
    }, []);

    const handleDotAnimationEnd = () => {
      setShowBlueDot(false);
    };

    if (totalUnseenCount === 0 && router.pathname === "/messages") {
      return <Message fill="#03A6CF" color="#03A6CF" variant="Bold" />;
    } else if (totalUnseenCount === 0 && router.pathname !== "/messages") {
      return <Message />;
    } else if (totalUnseenCount > 0 && router.pathname === "/messages") {
      return (
        <div style={{ position: "relative" }}>
          <Message fill="#03A6CF" color="#03A6CF" variant="Bold" />
          {showBlueDot && (
            <div
              style={{
                position: "absolute",
                top: "0px",
                right: "0px",
                width: "8px",
                height: "8px",
                background: "#03a6cf",
                borderRadius: "50%",
                animation: "falling-dot 1s linear forwards",
              }}
              onAnimationEnd={handleDotAnimationEnd}
            />
          )}
        </div>
      );
    } else if (totalUnseenCount > 0 && router.pathname !== "/messages") {
      return (
        <div style={{ position: "relative" }}>
          <Message />
          {showBlueDot && (
            <div
              style={{
                position: "absolute",
                top: "0px",
                right: "0px",
                width: "8px",
                height: "8px",
                background: "#03a6cf",
                borderRadius: "50%",
                animation: "falling-dot 1s linear forwards",
              }}
              onAnimationEnd={handleDotAnimationEnd}
            />
          )}
        </div>
      );
    }

    return null;
  };

  const ProfileIcon = ({ isActive, isUserLoggined }) => {
    if (isUserLoggined) {
      if (isActive) {
        return <Profile fill="#03A6CF" color="#03A6CF" variant="Bold" />;
      } else {
        return <Profile />;
      }
    } else {
      if (isActive) {
        return <LoginCurve fill="#03A6CF" color="#03A6CF" variant="Bold" />;
      } else {
        return <LoginCurve />;
      }
    }
  };

  return (
    <>
      <section
        className={`h-16 w-full bg-white shadow-[1px_1px_10px_#9d9d9d] flex justify-between items-cente`}
      >
        <div className="flex justify-around items-center w-full">
          <Link href={"/"} prefetch={false} className="flex flex-col items-center">
            <div>
              {router.pathname === "/" ? (
                <Home fill="#03A6CF" color="#03A6CF" variant="Bold" />
              ) : (
                <Home />
              )}
            </div>
            <p className={`title2 pt-1 ${router.pathname === "/" ? "text-main1" : ""}`}>
              {t("home")}
            </p>
          </Link>
          <Link href={"/map"} prefetch={false} className="flex flex-col items-center">
            <div>
              {router.pathname === "/map" ? (
                <Map1 fill="#03A6CF" color="#03A6CF" variant="Bold" />
              ) : (
                <Map1 />
              )}
            </div>
            <p className={`title2 pt-1 ${router.pathname === "/map" ? "text-main1" : ""}`}>
              {t("map")}
            </p>
          </Link>
        </div>
        <div className="-mt-[20px]">
          <Link
            href={currentUserId ? "/create-form" : "/create"}
            className={`w-[60px] h-[60px] bg-main2 rounded-full flex justify-center items-center shadow-[0px_2px_6px_1px_#8D8D8D]`}
            prefetch={false}
          >
            <div className="w-[25.1px] h-[25.1px] rounded-full flex justify-center items-center bg-white">
              <Plus w={12.5} h={12.5} color="#03A6CF" />
            </div>
          </Link>
        </div>
        <div className="flex justify-around items-center w-full">
          <Link href={"/messages"} className="flex flex-col items-center" prefetch={false}>
            <MessageComponent />
            <p className={`title2 pt-1 ${router.pathname === "/messages" ? "text-main1" : ""}`}>
              {t("chat")}
            </p>
          </Link>

          <Link
            href={currentUserId ? "/my-profile" : "/login"}
            prefetch={false}
            className="flex flex-col items-center"
          >
            <div>
              {router.pathname === "/login" ||
              router.pathname === "/my-profile" ||
              router.pathname === "/wallet" ? (
                <ProfileIcon isUserLoggined={!!currentUserId} isActive={true} />
              ) : (
                <ProfileIcon isUserLoggined={!!currentUserId} isActive={false} />
              )}
            </div>
            <p
              className={`title2 pt-1 ${
                router.pathname === "/login" ||
                router.pathname === "/my-profile" ||
                router.pathname === "/wallet"
                  ? "text-main1"
                  : ""
              }`}
            >
              {!!currentUserId ? t("justProfile") : t("login.title")}
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
