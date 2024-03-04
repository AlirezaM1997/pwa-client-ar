import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { usePWAInstall } from "react-use-pwa-install";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
//FUNCTION
import { getFromStorage } from "@functions/getFromStorage";
//HOOK
import { useInitailSetting } from "@hooks/useInitailSetting";
//COMPONENT
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import SetNameBottomSheet from "./SetNameBottomSheet";
//COMPONENT DYNAMIC IMPORT
const InstallDialog = dynamic(() => import("./InstallDialog"), {
  ssr: false,
});
const FooterMenu = dynamic(() => import("@components/common/FooterMenu"), {
  ssr: false,
});
const DesktopHeader = dynamic(() => import("@components/common/DesktopHeader"), {
  ssr: false,
});
const GlobalSearchModal = dynamic(() => import("@components/common/globalSearchModal/Main"), {
  ssr: false,
});

export default function Layout(props) {
  const { t: tHome } = useTranslation("home");
  const { t } = useTranslation();
  const router = useRouter();
  const [showSearchView, setShowSearchView] = useState(false);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestInstall, setShowSuggestInstall] = useState(false);
  const [openSetNameBottomSheet, setOpenSetNameBottomSheet] = useState(false);
  const accounts = useSelector((state) => state.accounts.accounts);
  const token = useSelector((state) => state.token);
  const currentUserId = accounts.filter((i) => i._id === token?._id);
  const install = usePWAInstall();

  //HANDLE-SHOW-INSTALL-DIALOG
  useEffect(() => {
    const _s = getFromStorage("INSTALL_DIALOG");
    if (!_s && install) {
      const timer = setTimeout(() => {
        setShowSuggestInstall(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
    // document.body.style.overflow = "unset";
  });

  //HANDLE-FIRST-USER-LOGGINED
  useEffect(() => {
    if (!currentUserId[0]?.name && token?._id) {
      setTimeout(() => {
        setOpenSetNameBottomSheet(true);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    if (router.pathname !== "/map") {
      //CLEAR-OTHER-ITEM-FROM-LOCALSTORAGE-BASED-ON-SOME-REASON
      localStorage.removeItem("initialUrl");
      localStorage.removeItem("initialParams");
    }
  }, []);

  useEffect(() => {
    if (openSetNameBottomSheet) {
      document.body.style.overflow = "hidden"
    }
  }, [openSetNameBottomSheet])

  const { lang, fakeLoading } = useInitailSetting();

  if (fakeLoading || isLoading) return <LoadingScreen />;
  return (
    <div
      dir={lang == "ar" ? "rtl" : "ltr"}
      className={lang == "ar" ? "font-Dana" : "font-Poppins"}
    >
      {props.hiddenDesktopHeaderRoutes.filter((r) => router.pathname.replace("/", "").startsWith(r))
        .length === 0 && (
          // Thats Should be changed in feature >>>>> z-index
          <div className="hidden lg:block relative">
            <DesktopHeader
              onClick={() => setShowSearchView(true)}
              setShowSearchView={setShowSearchView}
              valueInput={text}
              setValueInput={setText}
              setIsLoading={setIsLoading}
            />
          </div>
        )}

      {props.children}

      {props.hiddenFooterMenuRoutes.filter((r) => router.pathname.replace("/", "").startsWith(r))
        .length === 0 && (
          <div className="bottom-[0px] fixed w-full z-[9999] lg:hidden">
            <FooterMenu />
          </div>
        )}

      <Toaster
        containerStyle={{
          top: 20,
          left: 20,
          bottom: 20,
          right: 20,
          zIndex: 99999999,
        }}
      />

      {showSearchView && (
        <GlobalSearchModal
          lang={lang}
          tHome={tHome}
          setShowSearchView={setShowSearchView}
          showSearchView={showSearchView}
          text={text}
          setText={setText}
        />
      )}

      {showSuggestInstall && (
        <InstallDialog
          showSuggestInstall={showSuggestInstall}
          setShowSuggestInstall={setShowSuggestInstall}
          t={t}
        />
      )}

      {openSetNameBottomSheet && (
        <SetNameBottomSheet
          lang={lang}
          setOpenSetNameBottomSheet={setOpenSetNameBottomSheet}
          openSetNameBottomSheet={openSetNameBottomSheet}
        />
      )}
    </div>
  );
}
