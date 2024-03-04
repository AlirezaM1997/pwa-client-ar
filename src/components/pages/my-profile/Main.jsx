import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import {
  Activity,
  ArchiveMinus,
  DocumentText1,
  Edit2,
  I24Support,
  LogoutCurve,
  More,
  Profile as ProfileIcon,
  Setting2,
  Star1,
  Trash,
  Verify,
  Wallet3,
} from "iconsax-react";
import Link from "next/link";
import { setCookie } from "cookies-next";
import { useWindowSize } from "@uidotdev/usehooks";
import { useDispatch, useSelector } from "react-redux";
import StarRatingComponent from "react-star-rating-component";
//REDUX
import { tokenAction } from "@store/slices/token";
import { logOutAction } from "@store/slices/logout";
import { isUserAction } from "@store/slices/isUser";
import { accountsAction } from "@store/slices/accounts";
import { clearMessagesAction } from "@store/slices/message";
//COMPONENT
import BackButton from "@components/common/BackButton";
import CustomButton from "@components/kit/button/CustomButton";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
// COMPONENT DYNAMIC IMPORT
const Login = dynamic(() => import("@components/common/login/Main"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const CustomModal = dynamic(() => import("@components/kit/modal/CustomModal"), { ssr: false });
const ManageAccounts = dynamic(() => import("@components/common/ManageAccounts"), { ssr: false });
const SingleImageViewer = dynamic(() => import("@components/common/SingleImageViewer"), {
  ssr: false,
});
const CustomTransitionModal = dynamic(() => import("@components/kit/modal/CustomTransitionModal"), {
  ssr: false,
});

export default function MyProfile({ t, tP, lang, data, setLoading, isAssociation }) {
  //VARIABLE
  const router = useRouter();
  const [openMangeAccounts, setOpenMangeAccounts] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const size = useWindowSize();
  const [openLogoutModal, setOpenLogoutModal] = useState();
  const [nextUserAfterLogOutData, setNextUserAfterLogOutData] = useState(null);
  const [showProfileImg, setShowProfileImg] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false);
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.accounts);
  const token = useSelector((state) => state.token);

  //FUNCTIONS
  const changeAccounts = async (dataUser) => {
    if (dataUser._id !== token._id) {
      setLoading(true);
      dispatch(
        tokenAction({
          token: accounts.filter((x) => x._id === dataUser._id)[0]?.token,
          refreshHash: accounts.filter((x) => x._id === dataUser._id)[0]?.refreshHash,
          _id: dataUser._id,
        })
      );
      setCookie("NEXT_LOCALE", dataUser.lang);
      setTimeout(() => {
        if (dataUser.role === "user") {
          dispatch(isUserAction({ isUser: true }));
          dispatch(clearMessagesAction());
          setTimeout(() => {
            document.location.replace(`/${dataUser.lang}/my-profile`);
          }, 200);
        } else {
          dispatch(isUserAction({ isUser: false }));
          dispatch(clearMessagesAction());
          setTimeout(() => {
            document.location.replace(`/${dataUser.lang}/my-profile`);
          }, 200);
        }
      }, 500);
    } else return;
  };

  const logoutFunction = () => {
    setOpenLogoutModal(false);
    setOpenMangeAccounts(false);
    if (accounts.length > 1) {
      const _accounts = accounts.filter((i) => i._id !== token._id);
      dispatch(
        accountsAction({
          accounts: [..._accounts],
        })
      );
      changeAccounts(nextUserAfterLogOutData);
    } else {
      dispatch(logOutAction(true));
      localStorage.clear();
      sessionStorage.clear();
      router.push("/", undefined, { shallow: true });
    }
  };

  //CONSTANTS
  const mainList = [
    {
      title: isAssociation ? t("profile") : `${t("profile")} (${t("commingSoon")})`,
      description: isAssociation ? tP("profileDesAssociation") : tP("profileDes"),
      icon: <ProfileIcon color="#00839E" size={20} />,
      onClick: () => {
        isAssociation
          ? (function () {
              router.push(`/association-profile/${data._id}`, undefined, { shallow: true });
              setIsLoading(true);
            })()
          : null;
      },
      isDisabled: isAssociation ? false : true,
      flag: true,
    },
    {
      title: isAssociation ? tP("myProjects") : tP("myRequests"),
      description: isAssociation ? tP("actionsDesAssociation") : tP("actionsDesUser"),
      icon: <Activity color="#00839E" size={20} />,
      onClick: () => {
        setIsLoading(true);
        router.push(`/activity/actions-management`, undefined, { shallow: true });
      },
      isDisabled: false,
      flag: true,
    },
    {
      title: tP("favorites"),
      description: tP("favoritesDes"),
      icon: <ArchiveMinus color="#00839E" size={20} />,
      onClick: () => {
        setIsLoading(true);
        router.push(`/favorites`, undefined, { shallow: true });
      },
      isDisabled: false,
      flag: true,
    },
    {
      title: tP("licenseAndBelongingList"),
      description: tP("licenseAndBelongingListDes"),
      icon: <Activity color="#00839E" size={20} />,
      onClick: () => {
        setIsLoading(true);
        router.push(`/my-profile/requests-list?source=license`, undefined, { shallow: true });
      },
      isDisabled: false,
      flag: isAssociation ? true : false,
    },
    {
      title: t("donation"),
      description: tP("donationDes"),
      icon: <DocumentText1 color="#00839E" size={20} />,
      onClick: () => {
        setIsLoading(true);
        router.push(`/my-profile/participations?source=receipt`);
      },
      isDisabled: false,
      flag: true,
    },
    // {
    //   title: `${t("wallet")}`,
    //   description: tP("walletDes"),
    //   icon: <Wallet3 color="#00839E" size={20} />,
    //   onClick: () => {
    //     setIsLoading(true);
    //     router.push(`/wallet`, undefined, { shallow: true });
    //   },
    //   isDisabled: false,
    //   flag: true,
    // },
    {
      title: t("contactsupport"),
      description: t("onlinechat"),
      icon: <I24Support color="#00839E" size={20} />,
      onClick: () => {
        window.open("https://widget.raychat.io/654f1eabc8a6649d9137a710?version=2", "_blank");
      },
      isDisabled: false,
    },

    {
      title: tP("manageAccounts"),
      description: tP("manageAccountsDes"),
      icon: <LogoutCurve style={{ rotate: "180deg" }} color="#00839E" size={20} />,
      onClick: () => setOpenMangeAccounts(true),
      isDisabled: false,
      flag: true,
    },
    {
      title: t("setting"),
      description: tP("settingDes"),
      icon: <Setting2 color="#00839E" size={20} />,
      onClick: () => {
        setIsLoading(true);
        router.push(`/my-profile/setting`, undefined, { shallow: true });
      },
      isDisabled: false,
      flag: true,
    },
  ];
  if (isLoading) return <LoadingScreen />;

  const handleShowProfileImg = () => {
    setShowProfileImg(true);
    setProfileImgUrl(
      data?.image
        ? data.image
        : !isAssociation
        ? "/assets/images/default-user-image.png"
        : "/assets/images/default-association-image.png"
    );
    document.body.style.overflow = "hidden";
  };

  //JSX
  return (
    <>
      <header className="max-w-[1320px] 2xl:mx-auto">
        <div className="pt-[18px] px-4 bg-default w-full h-[115px] relative flex justify-between">
          <BackButton
            bgColor="bg-[#81D3E7]"
            arrowColor="#FDFDFD"
            onClick={() =>
              router.push(
                router.pathname.slice(0, router.pathname.lastIndexOf("/"))
                  ? router.pathname.slice(0, router.pathname.lastIndexOf("/"))
                  : "/",
                undefined,
                { locale: lang, shallow: true }
              )
            }
            dir={["Ar", "ar"].includes(lang) ? "right" : "left"}
          />
          <div
            className="bg-[#81D3E7] rounded-full w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
            onClick={() => setOpenDeleteAccountModal(true)}
          >
            <More color="#FDFDFD" />
          </div>
          <div
            className={`w-[95px] h-[95px]  absolute top-[72px] rounded-full border-[4px] border-white bg-white cursor-pointer`}
            onClick={handleShowProfileImg}
          >
            <Image
              src={
                data?.image
                  ? data.image
                  : !isAssociation
                  ? "/assets/images/default-user-image.png"
                  : "/assets/images/default-association-image.png"
              }
              layout="fill"
              alt="profile-image"
              className="rounded-full cover-center-img"
              priority={true}
            ></Image>
          </div>
        </div>
        <div className="flex flex-col px-4">
          <div className="flex justify-end pt-3">
            <CustomButton
              title={tP("editProfile")}
              styleType={"Secondary"}
              siza={"X"}
              textColor={"text-[#03A6CF]"}
              borderColor={"border-[#03A6CF]"}
              paddingX={"px-[14px]"}
              icon={<Edit2 color="#03A6CF" />}
              onClick={() => {
                router.push(`/my-profile/edit-profile`, undefined, { shallow: true });
                setIsLoading(true);
              }}
              isIconLeftSide={true}
            />
          </div>
          <div className="py-[14px] flex flex-row items-center gap-2">
            <h1 className="title1">
              {isAssociation
                ? `${data?.prename || ""} ${
                    data?.justName ||
                    data?.name ||
                    accounts.filter((account) => account._id === token._id)?.[0]?.name ||
                    t("pendingSetName")
                  }`
                : `${
                    data?.justName ||
                    data?.name ||
                    accounts.filter((account) => account._id === token._id)?.[0]?.name ||
                    t("pendingSetName")
                  }`}
            </h1>
            {data?.verifyBadge && (
              <Verify size="14" color="#2889d7" variant="Bold" className="shrink-0 mt-1" />
            )}
          </div>
          {isAssociation && data?.averageScore > 0 && (
            <div className="starIconClass flex items-center">
              <StarRatingComponent
                name="rate1"
                value={data?.averageScore}
                renderStarIcon={(index) => {
                  return (
                    <span>
                      {index <= data?.averageScore ? (
                        <div className="starIconFillClass mx-[2px]">
                          <Star1 color="#EFC840" />
                        </div>
                      ) : (
                        <div className="starIconUnFillClass mx-[2px]">
                          <Star1 color="#E8E8E8" />
                        </div>
                      )}
                    </span>
                  );
                }}
              />
              <span className="mx-1 text-gray2 caption4">
                ({data?.scoreCount ? data.scoreCount : 0})
              </span>
            </div>
          )}
          {isAssociation ? (
            <div className="flex items-center mt-3">
              <div className="flex items-center">
                <span className="title2 ltr:pr-[6px] rtl:pl-[6px]">{data?.projectsCount}</span>
                <p className="caption3 text-gray4">{t("project")}</p>
              </div>
              <Link
                href={`/my-profile/followers`}
                className="flex items-center mx-[15px]"
                prefetch={false}
              >
                <span className="title2 ltr:pr-[6px] rtl:pl-[6px]">
                  {data?.followerCount ? data.followerCount : 0}
                </span>
                <p className="caption3 text-gray4">{t("follower")}</p>
              </Link>
              <Link href={`/my-profile/followings`} className="flex items-center" prefetch={false}>
                <span className="title2 ltr:pr-[6px] rtl:pl-[6px]">
                  {data?.followingCount ? data.followingCount : 0}
                </span>
                <p className="caption3 text-gray4">{t("following")}</p>
              </Link>
            </div>
          ) : (
            <div className="flex items-center mt-[6px] gap-x-5">
              <div className="flex items-center">
                <span className="title2 ltr:pr-[6px] rtl:pl-[6px]">{data?.projectsCount}</span>
                <p className="caption3 text-gray4">{t("request")}</p>
              </div>
              <Link href={`/my-profile/followings`} className="flex items-center" prefetch={false}>
                <span className="title2 ltr:pr-[6px] rtl:pl-[6px]">
                  {data?.followingCount ? data.followingCount : 0}
                </span>
                <p className="caption3 text-gray4">{t("following")}</p>
              </Link>
            </div>
          )}
        </div>
      </header>
      <main className="flex flex-col mt-[38px] px-4 pb-[100px] max-w-[1320px] 2xl:mx-auto">
        {mainList
          .filter((i) => i?.flag)
          .map((item, _index) => (
            <div
              key={_index}
              className={`flex items-center mb-[35px] cursor-pointer ${
                item.isDisabled ? "opacity-50" : ""
              }`}
              onClick={item.onClick}
            >
              <div className="w-[38px] h-[38px] flex items-center justify-center ltr:mr-[10px] rtl:ml-[10px] bg-main7 rounded-lg">
                {item.icon}
              </div>
              <div>
                <h1 className="title1">{item.title}</h1>
                <p className="text-gray4 caption3">{item.description}</p>
              </div>
            </div>
          ))}
      </main>
      {size.width < 960 ? (
        <BottomSheet open={openMangeAccounts} setOpen={setOpenMangeAccounts}>
          <ManageAccounts
            tP={tP}
            setOpenMangeAccounts={setOpenMangeAccounts}
            setOpenLogin={setOpenLogin}
            setOpenLogoutModal={setOpenLogoutModal}
            changeAccounts={changeAccounts}
            setNextUserAfterLogOutData={setNextUserAfterLogOutData}
          />
        </BottomSheet>
      ) : (
        <CustomTransitionModal
          open={openMangeAccounts}
          close={() => setOpenMangeAccounts(false)}
          width="450px"
          hasCloseBtn={false}
        >
          <ManageAccounts
            tP={tP}
            setOpenMangeAccounts={setOpenMangeAccounts}
            setOpenLogin={setOpenLogin}
            setOpenLogoutModal={setOpenLogoutModal}
            changeAccounts={changeAccounts}
            setNextUserAfterLogOutData={setNextUserAfterLogOutData}
          />
        </CustomTransitionModal>
      )}
      {openLogin && (
        <ModalScreen open={openLogin} close={() => setOpenLogin(false)}>
          <Login t={t} setShowLogin={setOpenLogin} modalMode={true} landingRoute="/my-profile" />
        </ModalScreen>
      )}
      <CustomModal
        title={t("logoutMessage")}
        openState={openLogoutModal}
        cancelOnClick={() => {
          setOpenLogoutModal(false);
        }}
        hasOneButton={false}
        cancelLabel={t("no")}
        okOnClick={() => logoutFunction()}
      />
      <SingleImageViewer
        open={showProfileImg}
        setOpen={setShowProfileImg}
        url={profileImgUrl}
        setUrl={setProfileImgUrl}
      />
      <CustomModal
        title={tP("deleteAccountMessageTitle")}
        description={tP("deleteAccountMessageDescription")}
        openState={openDeleteAccountModal}
        cancelOnClick={() => setOpenDeleteAccountModal(false)}
        okOnClick={() => {
          router.push(`/delete-account`);
          setLoading(true);
        }}
        hasOneButton={false}
        icon={
          <div className="flex items-center justify-center rounded-full bg-[#FFEBEB] w-[80px] h-[80px]">
            <Trash color="#E53535" size={40} />
          </div>
        }
        okBgColor={"bg-danger"}
        okLabel={t("clear")}
        cancelLabel={t("cancel")}
      />
      <style>
        {`
          .starIconClass svg {
            width : 16px ;
            height : 16px ;
          }
          .starIconFillClass svg {
            fill: #EFC840
          }
          .starIconUnFillClass svg {
            fill: #E8E8E8
          }
        `}
      </style>
    </>
  );
}
