import { useSelector } from "react-redux";
import {
  AddSquare,
  ArrowDown2,
  Chart,
  LanguageSquare,
  LoginCurve,
  Map1,
  Profile,
  SearchNormal1,
  Setting2,
  Sms,
  UserTag,
} from "iconsax-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
//HOOK
import { useQuery } from "@apollo/client";
import useClickOutside from "@hooks/useClickOutside";
// GQL
import { GET_MY_CHAT } from "@services/gql/query/GET_MY_CHAT";
// COMPONENT
import CustomButton from "../kit/button/CustomButton";
// COMPONENT DYNAMIC IMPORT
const ChangeLang = dynamic(() => import("@components/common/ChangeLang"), { ssr: false });

export default function DesktopHeader({
  setIsLoading,
  valueInput = "",
  setValueInput = () => null,
  onClick = () => null,
  position = "sticky",
  setShowSearchView,
}) {
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();
  const { t } = useTranslation();
  const currentUserId = useSelector((state) => state.token._id);
  const isUser = useSelector((state) => state.isUser.isUser);

  const { data } = useQuery(GET_MY_CHAT);

  const chatRooms = data?.get_my_chat || [];
  const totalUnseenCount = chatRooms.reduce(
    (chatCount, chatRoom) => chatCount + (chatRoom.unseenCount || 0),
    0
  );

  const [showLangModal, setShowLangModal] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);

  const handleLayoutIcon = async (href) => {
    await router.push(href, undefined, { shallow: true });
  };

  const elementRefs = useClickOutside([
    () => setShowLangModal(false),
    () => setOpenDropDown(false),
  ]);

  useEffect(() => {
    if (router.query?.search?.length > 0) {
      setValueInput(router.query?.search);
    } else {
      setValueInput("");
    }
  }, [router.query]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      setShowSearchView(false);
      document.body.style.overflow = "unset";
      router.push(
        {
          pathname: "/search",
          query: { search: valueInput, source: "project", sort: "LATEST" },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const DropDownProfile = () => {
    return (
      <div className="w-[190px] h-[152px] bg-white rounded-[10px] absolute top-[40px] flex flex-col justify-center items-start px-5 shadow-md rtl:-right-5 ltr:-left-5">
        <Link
          href={"/my-profile"}
          onClick={() => setOpenDropDown(!openDropDown)}
          className="flex items-center gap-x-3"
          prefetch={false}
        >
          <UserTag size={20} />
          <p className="text-[16px] font-medium leading-[40px]">{t("account")}</p>
        </Link>
        <Link
          href={"/activity/actions-management"}
          onClick={() => setOpenDropDown(!openDropDown)}
          className="flex items-center gap-x-3"
          prefetch={false}
        >
          <Chart size={20} />
          <p className="text-[16px] font-medium leading-[40px]">
            {isUser ? t("myRequests") : t("myProjects")}
          </p>
        </Link>
        <Link
          href={"/my-profile/setting"}
          onClick={() => setOpenDropDown(!openDropDown)}
          className="flex items-center gap-x-3"
          prefetch={false}
        >
          <Setting2 size={20} />
          <p className="text-[16px] font-medium leading-[40px]">{t("setting")}</p>
        </Link>
      </div>
    );
  };

  return (
    <>
      <div
        className={`flex flex-col lg:flex-row lg:items-center lg:justify-between w-full border-b-[1px] border-gray5 pt-[15px] pb-[15px] lg:pt-[42px] lg:pb-[30px] shadow-md ${position} z-[10002] bg-white px-4`}
      >
        <div className="flex flex-col lg:flex-row w-full ">
          <div className="flex items-center">
            <Link href={"/"} prefetch={false}>
              <div className="relative w-[180px] h-[48px]  rtl:ml-3 ltr:mr-3">
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
            </Link>
          </div>
          <div className="w-full flex items-center mt-[14px] lg:mt-0 lg:w-[350px] xl:w-[400px] 2xl:w-[498px] 1800:!w-[544px] relative">
            <input
              className={`w-full py-[7px] lg:py-[14px] ltr:pr-[35px] ltr:pl-5 rtl:pr-5 rtl:pl-[35px] caption4 lg:cta3 bg-gray5 outline-none rounded-[27px] border-none focus:border-none`}
              placeholder={t("search")}
              autoComplete="off"
              value={valueInput}
              onClick={onClick}
              onChange={(e) => {
                setValueInput(e.target.value);
                setShowSearchView(true);
              }}
              onKeyDown={handleKeyDown}
            />
            <div className={`absolute  ${lang == "ar" ? "left-[25px]" : "right-[25px]"} px-1`}>
              <SearchNormal1 color="#7B808C" size="16" />
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-x-[30px]">
          <div className="flex items-center gap-x-5">
            {router.pathname !== "/my-profile/setting" && (
              <div className="relative" ref={elementRefs[0]}>
                <LanguageSquare
                  size={24}
                  color="#292D32"
                  onClick={() => setShowLangModal(!showLangModal)}
                  className="cursor-pointer"
                />
                {showLangModal && (
                  <div className="absolute top-[40px] rtl:-right-5 ltr:-left-5 h-[199px] w-[325px] bg-white border rounded-[10px] border-gray-5">
                    <ChangeLang classNames="pt-[25px]" />
                  </div>
                )}
              </div>
            )}
            <span className=" w-[1px] h-5 bg-gray6"></span>
            {!!currentUserId ? (
              <div className="relative" ref={elementRefs[1]}>
                <div
                  onClick={() => setOpenDropDown(!openDropDown)}
                  className="flex items-center gap-x-[2px]  cursor-pointer"
                >
                  <Profile />
                  <ArrowDown2 size={13} />
                </div>
                {openDropDown && <DropDownProfile />}
              </div>
            ) : (
              <div onClick={() => handleLayoutIcon(currentUserId ? "/my-profile" : "/login")}>
                <LoginCurve setIsLoading={setIsLoading} />
              </div>
            )}
            <span className=" w-[1px] h-5 bg-gray6"></span>
            <div onClick={() => handleLayoutIcon("/map")} className="cursor-pointer">
              <Map1 setIsLoading={setIsLoading} />
            </div>
            <span className="w-[1px] h-5 bg-gray6"></span>
            <div onClick={() => handleLayoutIcon("/messages")} className="cursor-pointer">
              <div>
                {totalUnseenCount === 0 ? (
                  <Sms />
                ) : (
                  <div style={{ position: "relative" }}>
                    <Sms />
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
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {!currentUserId ? (
            <CustomButton
              title={t("login.title")}
              setIsLoading={setIsLoading}
              onClick={() => handleLayoutIcon("/my-profile")}
              size="M"
              width={lang === "en" ? "w-[120px]" : "w-[125px]"}
            />
          ) : (
            <CustomButton
              title={isUser ? t("createRequest") : t("creatProject")}
              setIsLoading={setIsLoading}
              onClick={async () => {
                setIsLoading(true);
                await router.push(currentUserId ? "/create-form" : "/create", undefined, {
                  shallow: true,
                });
                setIsLoading(false);
              }}
              isIconLeftSide={true}
              size="M"
              icon={<AddSquare />}
              width={lang === "en" ? "w-[160px]" : "w-[165px]"}
            />
          )}
        </div>
      </div>
    </>
  );
}
