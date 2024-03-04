import { useState } from "react";
import { Card } from "iconsax-react";
import { useWindowSize } from "@uidotdev/usehooks";
import { useMutation, useQuery } from "@apollo/client";
// GQL
import { ADD_SHABA_WALLET } from "@services/gql/mutation/ADD_SHABA_WALLET";
import { GET_MY_SHABA_WALLETS } from "@services/gql/query/GET_MY_SHABA_WALLETS";
// FUNCTION
import { isNumberKey } from "@functions/isNumberKey";
import { formatCartNumber } from "@functions/formatCartNumber";
// COMPONENT
import Loading from "@components/kit/loading/Loading";
import PlainInput from "@components/kit/Input/PlainInput";
import CustomButton from "@components/kit/button/CustomButton";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import dynamic from "next/dynamic";
// COMPONENT DYNAMIC IMPORT
const NoResult = dynamic(() => import("@components/common/NoResult"), { ssr: false });
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const CustomTransitionModal = dynamic(() => import("@components/kit/modal/CustomTransitionModal"), {
  ssr: false,
});

export default function AccountsSection({ t, tW }) {
  const size = useWindowSize();
  const [cartNumber, setCartNumber] = useState("");
  const [openAddCart, setOpenAddCart] = useState(false);
  const [add_cart] = useMutation(ADD_SHABA_WALLET);
  const { data, loading, refetch } = useQuery(GET_MY_SHABA_WALLETS);

  const addCart = async () => {
    try {
      const {
        data: { add_shaba_wallet },
      } = await add_cart({
        variables: {
          cartNumber,
          bankName: null,
        },
      });
      if (add_shaba_wallet.status === 200) {
        refetch();
        setCartNumber(null);
        setOpenAddCart(false);
      }
    } catch (error) {
      console.log(error);
      setOpenAddCart(false);
    }
  };

  const handleSetCardInMobile = (value) => {
    if (value.length <= 16) setCartNumber(value)
  }

  if (loading) return size.width < 960 ? <LoadingScreen /> : <Loading />;
  return (
    <>
      <div className="px-4 pb-[100px] ">
        {data.get_my_shaba_wallets.length !== 0 ? (
          data.get_my_shaba_wallets
            .filter((item) => !!item.cartNumber)
            .map((item, index) => (
              <div
                key={index}
                dir="ltr"
                className="py-4 flex items-center gap-x-3 lg:gap-x-[15px] border-b-[1px] border-gray5"
              >
                <div className="w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] rounded-lg bg-main8 flex items-center justify-center">
                  <Card size={size.width < 960 ? 20 : 24} color="#00839E" />
                </div>
                <div>
                  <div className="flex items-center textInput lg:text-[18px] lg:font-bold lg:leading-[30px] text-gray2">
                    <p>{formatCartNumber(item.cartNumber)}</p>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <NoResult />
        )}
      </div>

      <div className="fixed bottom-[14px] w-full lg:w-fit px-4 lg:bottom-5 lg:p-0 lg:ltr:right-6 lg:rtl:left-6 lg:absolute">
        <CustomButton
          onClick={() => setOpenAddCart(true)}
          title={tW("addAccount")}
          isFullWidth={size.width < 960 ? true : false}
          width={size.width < 960 ? "" : "w-[180px]"}
          size="M"
        />
      </div>

      {size.width < 960 ? (
        <BottomSheet
          open={openAddCart}
          setOpen={setOpenAddCart}
          onCloseEnd={() => {
            setCartNumber("");
            setOpenAddCart(false);
          }}
        >
          <div className="pb-[14px] px-4">
            <div className=" flex items-center gap-x-2">
              <div className="w-full">
                <PlainInput
                  value={cartNumber}
                  setValue={handleSetCardInMobile}
                  labelText={tW("addCardNumber")}
                  maxLength={16}
                  inputDir="ltr"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  type="number"
                />
              </div>
            </div>
            <CustomButton
              onClick={addCart}
              title={t("confirm")}
              isFullWidth={true}
              size="M"
              isDisabled={cartNumber?.length < 16}
              isPointerEventsNone={cartNumber?.length < 16}
            />
          </div>
        </BottomSheet>
      ) : (
        <CustomTransitionModal
          hasCloseBtn={false}
          open={openAddCart}
          close={() => {
            setOpenAddCart(false);
            setCartNumber("");
          }}
          width="700px"
        >
          <div className="p-[25px]">
            <div className=" flex rtl:flex-row-reverse items-center gap-x-2">
              <div className="w-full">
                <PlainInput
                  value={cartNumber}
                  setValue={setCartNumber}
                  labelText={tW("addCardNumber")}
                  maxLength={16}
                  onKeyDown={isNumberKey}
                  inputDir="ltr"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <CustomButton
                onClick={addCart}
                title={t("confirm")}
                isFullWidth={false}
                width="w-[180px]"
                size="M"
                isDisabled={cartNumber?.length < 16}
                isPointerEventsNone={cartNumber?.length < 16}
              />
            </div>
          </div>
        </CustomTransitionModal>
      )}
    </>
  );
}
