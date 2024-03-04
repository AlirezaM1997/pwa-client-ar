import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { HambergerMenu } from "iconsax-react";
import Image from "next/legacy/image";
// HOOK
import useClickOutside from "@hooks/useClickOutside";
// COMPONENT
import ChangeLang from "@components/common/ChangeLang";
import BergerMenu from "@components/pages/landing/BergerMenu";

export default function Layout(props) {
  const router = useRouter();
  const lang = getCookie("NEXT_LOCALE") || "en";
  const [openBergerMenu, setOpenBergerMenu] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const elementRefs = useClickOutside([() => setShowLangModal(false)]);

  return (
    <>
      <div className="max-w-[1320px] 2xl:mx-auto">
        <header className="px-4 lg:px-[30px] pt-2 lg:pt-4 sticky flex items-center justify-between">
          <Link href={"/"} prefetch={false}>
            <div className="relative w-[116px] lg:w-[230px] h-[34px] lg:h-[65px]">
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
          <nav className="hidden lg:flex items-center gap-x-2">
            <div className="relative px-4" ref={elementRefs[0]}>
              <HambergerMenu
                size={24}
                color="#292D32"
                onClick={() => setShowLangModal(!showLangModal)}
                className="cursor-pointer"
              />
              {showLangModal && (
                <div className="absolute top-[40px] rtl:-right-5 ltr:-left-5 h-[199px] w-[220px] bg-white border rounded-[10px] border-gray-5">
                  <ChangeLang classNames="pt-[25px]" />
                </div>
              )}
            </div>
            <Link
              href={"/"}
              className="hover:bg-main6 rounded-[30px] px-4 py-[13px]"
              prefetch={false}
            >
              <p>{props.t("home")}</p>
            </Link>
            <Link
              href={"/landing/about"}
              className={`hover:bg-main6 ${
                router.pathname === "/landing/about" && "bg-main6"
              } rounded-[30px] px-4 py-[13px]`}
              prefetch={false}
            >
              <p>{props.t("about")}</p>
            </Link>
          </nav>
          <div
            className="lg:hidden"
            onClick={() => {
              setOpenBergerMenu(true);
              document.body.style.overflow = "hidden";
            }}
          >
            <HambergerMenu size={22} />
          </div>
        </header>
        {props.children}
        <footer className="bg-main8 mt-[85px] lg:mt-[125px] pb-8 pt-9 lg:pt-[45px] w-full">
          <nav className="flex items-center justify-center w-full gap-x-2">
            <Link
              href={"/"}
              className="hover:bg-main6 rounded-[30px] px-4 py-[13px]"
              prefetch={false}
            >
              <p>{props.t("home")}</p>
            </Link>
            <Link
              href={"/landing/about"}
              className="hover:bg-main6 rounded-[30px] px-4 py-[13px]"
              prefetch={false}
            >
              <p>{props.t("about")}</p>
            </Link>
          </nav>
        </footer>
      </div>
      <div>
        <BergerMenu
          t={props.t}
          tLanding={props.tLanding}
          setOpenBergerMenu={setOpenBergerMenu}
          openBergerMenu={openBergerMenu}
        />
      </div>
    </>
  );
}
