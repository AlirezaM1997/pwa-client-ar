import { useState } from "react";
import dynamic from "next/dynamic";
import { Profile } from "iconsax-react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
//REDUX
import { accountsAction } from "@store/slices/accounts";
//GQL
import { SET_NAME } from "@services/gql/mutation/SET_NAME";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

//COMPONENT DYNAMIC IMPORT
const PlainInput = dynamic(() => import("@components/kit/Input/PlainInput"), { ssr: false });

export default function SetNameBottomSheet({ setOpenSetNameBottomSheet }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const isUser = useSelector((state) => state.isUser.isUser);
  const [name, setName] = useState("");
  const [preName, setPreName] = useState(null);
  const [setName_mutation] = useMutation(SET_NAME);
  const accounts = useSelector((state) => state.accounts.accounts);
  const token = useSelector((state) => state.token);
  const setNameFunction = async () => {
    if (!name) return;
    try {
      const {
        data: { set_name },
      } = await setName_mutation({
        variables: {
          name,
          prename: preName?.value,
        },
      });
      if (set_name.status === 200) {
        dispatch(
          accountsAction({
            accounts: accounts.map((item) =>
              item._id !== token._id ? item : { ...item, name: name }
            ),
          })
        );
        setTimeout(() => {
          setOpenSetNameBottomSheet(false);
          document.body.style.overflow = "unset";
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // const { loading, data } = useQuery(GET_ASSOCIATIONS_PRENAMES);
  // if (loading) return <LoadingScreen />;
  return (
    <>
      <div className="fixed left-0 bottom-0 w-full h-screen bg-[#00000040] backdrop-blur-[2px] z-[99999]">
        <div className="fixed bottom-0 w-full">
          <div className="w-full h-auto flex justify-center items-center bg-white rounded-t-[30px] pt-6 px-4">
            <div className="w-full px-4 pb-6">
              <h1 className="heading">{t("displayName")}</h1>
              <p className="caption1 pb-5">{t("setNameMessage")}</p>
              {/* {!isUser && (
          <SelectInput
            t={t}
            options={data.get_associations_prenames.map((item) => {
              return {
                value: item.title,
                label: item.title,
              };
            })}
            value={preName}
            onChange={setPreName}
            labelText={t("kind")}
            icon={<DocumentText size={16} />}
          />
        )} */}
              <PlainInput
                value={name}
                setValue={setName}
                labelText={t("displayName")}
                icon={<Profile size={16} />}
                placeholder={isUser ? t("namePlaceholder") : t("associationPlaceholder")}
              />
              {/* {!isUser && (
          <p className="text-main2 cta2 -mt-4">
            {preName?.label} {name}
          </p>
        )} */}
              <div className="pt-4">
                <CustomButton
                  title={t("ok")}
                  size={"S"}
                  isFullWidth={true}
                  onClick={() => {
                    setNameFunction();
                  }}
                  isDisabled={!name ? true : false}
                />
                {/* {!isUser && name && preName && (
            <CustomButton
              title={t("ok")}
              size={"S"}
              isFullWidth={true}
              onClick={() => {
                setNameFunction();
              }}
            />
          )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
