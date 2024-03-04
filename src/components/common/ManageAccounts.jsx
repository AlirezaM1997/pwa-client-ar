import Image from "next/legacy/image";
import { Logout } from "iconsax-react";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "@uidotdev/usehooks";
//GQL
import { GET_LOGGEDIN_USERS } from "@services/gql/query/GET_LOGGEDIN_USERS";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";
import ManageAccountSkeleton from "./skeleton/ManageAccountSkeleton";

export default function ManageAccounts({
  tP,
  setOpenLogin,
  setOpenMangeAccounts,
  setOpenLogoutModal,
  changeAccounts,
  setNextUserAfterLogOutData,
}) {
  //VARIABLE
  const ids = useSelector((state) => state.accounts.accounts?.map((i) => i._id));
  const token = useSelector((state) => state.token);
  const { t } = useTranslation();
  const { data, loading } = useQuery(GET_LOGGEDIN_USERS, {
    variables: {
      ids,
    },
    fetchPolicy: "no-cache",
  });
  const size = useWindowSize();

  //FUNCTION
  const handleLogOut = (e) => {
    e.stopPropagation();
    setOpenMangeAccounts(false);
    setOpenLogoutModal(true);
    const _nextUserAfterLogOutData =
      data?.getLoggedInUsers.length > 1
        ? data?.getLoggedInUsers.filter((i) => i._id !== token._id)[0]
        : null;
    setNextUserAfterLogOutData(_nextUserAfterLogOutData);
  };

  //JSX
  if (loading || !data) return <ManageAccountSkeleton />;
  return (
    <>
      <div className={`p-4 lg:p-[25px]`}>
        <ul className="w-full max-h-[500px] overflow-y-auto mb-5">
          {data?.getLoggedInUsers.map((item, index) => (
            <li
              key={index}
              className={` flex items-center justify-between mb-2 p-2 rounded-lg inputTypeRadio cursor-pointer`}
              onClick={() => changeAccounts(item)}
            >
              <div
                className={`${
                  item._id === token._id ? "pointer-events-none" : ""
                } flex items-center`}
              >
                <input
                  type="radio"
                  name="list"
                  value={item._id}
                  id={item._id}
                  checked={item._id === token._id}
                  onChange={() => changeAccounts(item)}
                  className="cursor-pointer"
                />
                <label htmlFor={item._id} className="flex items-center ltr:pl-[18px] rtl:pr-[18px]">
                  <div className={`w-[40px] h-[40px] relative`}>
                    <Image
                      src={
                        item.image
                          ? item.image
                          : item.role === "user"
                          ? "/assets/images/default-user-image.png"
                          : "/assets/images/default-association-image.png"
                      }
                      layout="fill"
                      alt="profile-image"
                      className="rounded-full cover-center-img"
                    ></Image>
                  </div>
                  <div className="mr-[9px] ltr:ml-[9px]">
                    <div className="flex items-center lg:gap-x-6">
                      <div className="title2">{item.name}</div>
                      <div className="caption3 text-white bg-main2 py-[2px] px-2 w-fit rounded-lg hidden lg:block">
                        {item.role === "user" ? t("user") : t("association")}
                      </div>
                    </div>
                    <div
                      dir="ltr"
                      className="text-[10px] leading-[20px] font-normal text-gray4 ltr:text-left rtl:text-right"
                    >
                      {item.phoneNumber}
                    </div>
                    <div className="caption3 text-white bg-main2 py-[2px] px-2 w-fit rounded-lg lg:hidden">
                      {item.role === "user" ? t("user") : t("association")}
                    </div>
                  </div>
                </label>
              </div>
              {item._id === token._id && (
                <div onClick={handleLogOut} className="rtl:rotate-180 cursor-pointer">
                  <Logout color="#E92828" />
                </div>
              )}
            </li>
          ))}
        </ul>
        <CustomButton
          title={tP("addAccount")}
          size={"S"}
          isFullWidth={true}
          onClick={() => {
            setOpenLogin(true);
            setOpenMangeAccounts(false);
          }}
        />
      </div>
    </>
  );
}
