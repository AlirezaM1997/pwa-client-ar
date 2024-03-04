import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { getCookie } from "cookies-next";
import { CloseCircle, HambergerMenu } from "iconsax-react";
// COMPONENT DYNAMIC IMPORT
const Header = dynamic(() => import("@components/common/Header"), {
  ssr: false,
});
const ChangeLang = dynamic(() => import("@components/common/ChangeLang"), {
  ssr: false,
});

export default function BergerMenu({ t, tLanding, setOpenBergerMenu, openBergerMenu }) {
  const [showLangModal, setShowLangModal] = useState(false);
  const lang = getCookie("NEXT_LOCALE") || "en";

  return (
    <div
      className={`h-screen px-4 fixed top-0 bottom-0 left-0 w-full bg-white ${
        openBergerMenu ? "" : "hidden"
      }`}
    >
      <header
        className={` lg:px-[30px] pt-2 lg:pt-4 flex items-center justify-between border-b-[1px] pb-[14px]`}
      >
        <Link href={"/"} prefetch={false}>
          <div className={`w-[116px] lg:w-[230px] h-[34px] lg:h-[65px] relative`}>
            <Image
              src={
                lang == "ar" ? "/assets/images/logo-mofid-fa.png" : "/assets/images/logo-mofid.png"
              }
              layout="fill"
              alt={"logo"}
            ></Image>
          </div>
        </Link>
        <div
          className=""
          onClick={() => {
            setOpenBergerMenu(false);
            document.body.style.overflow = "unset";
          }}
        >
          <CloseCircle size={22} />
        </div>
      </header>
      <main>
        <Link href={"/"} prefetch={false}>
          <p className="py-[20px]">{t("home")}</p>
        </Link>
        <Link href={"/login"} prefetch={false}>
          <p className="py-[20px]">{tLanding("loginSignup")}</p>
        </Link>
        <Link href={"/landing/about"} prefetch={false}>
          <p className="py-[20px]">{t("about")}</p>
        </Link>
        <div
          className="flex flex-row gap-3 items-center cursor-pointer"
          onClick={() => setShowLangModal(true)}
        >
          <p className="py-[20px]">{t("language")}</p>
          <HambergerMenu size={24} color="#292D32" />
        </div>
      </main>
      {showLangModal && (
        <div className="h-screen fixed flex flex-col bottom-0 z-[9999999] w-full top-0 left-0 bg-white">
          <Header onClick={() => setShowLangModal(false)} title={t("setting")} />
          <ChangeLang />
        </div>
      )}
    </div>
  );
}
