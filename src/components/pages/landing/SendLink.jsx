import "react-phone-input-2/lib/style.css";

import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import Image from "next/legacy/image";
import PhoneInput from "react-phone-input-2";
import { useMutation } from "@apollo/client";
import CustomButton from "@components/kit/button/CustomButton";
import parsePhoneNumber, { isValidNumberForRegion } from "libphonenumber-js";
// GQL
import { LANDING_SEND_LINKS } from "@services/gql/mutation/LANDING_SEND_LINKS";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });

export default function SendLink({ tLanding, t }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeBtn, setActiveBtn] = useState(false);

  const handleOnChange = (phoneInputValue, country) => {
    const phone = parsePhoneNumber(`+${phoneInputValue}`);
    const phoneNumberFormatted = phone?.formatNational();
    const res =
      phoneNumberFormatted &&
      phoneNumberFormatted?.length > 1 &&
      isValidNumberForRegion(phoneNumberFormatted, String(country.countryCode).toUpperCase());
    setActiveBtn(res);
    if (res) {
      setPhoneNumber(phoneInputValue);
    }
  };

  const [send_link] = useMutation(LANDING_SEND_LINKS);
  const sendLink = async () => {
    try {
      const {
        data: { landing_send_links },
      } = await send_link({
        variables: {
          phoneNumber: `+${phoneNumber}`,
        },
      });
      if (landing_send_links.status === 200) {
        toast.custom(() => <Toast text={t("ok")} />);
        setPhoneNumber("+964");
      }
    } catch (error) {
      console.error(error);
      toast.custom(() => <Toast text={error?.message} status="ERROR" />);
    }
  };

  return (
    <>
      <div className="relative w-[40px] h-[40px] lg:w-[60px] lg:h-[60px] ltr:left-2 rtl:right-2 -bottom-3 lg:-bottom-4 lg:ltr:-left-6 lg:rtl:-right-6">
        <Image src={"/assets/svg/landing/blue-circle-1.svg"} layout="fill" alt="SendLink-image" />
      </div>
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-y-[33px] lg:gap-x-[132px] lg:gap-y-0">
        <div className="relative w-[328px] h-[208px] lg:w-[540px] lg:h-[340px]">
          <Image src={"/assets/images/landing/SendLink.png"} layout="fill" alt="SendLink-image" />
        </div>
        <div className="px-4 lg:px-0">
          <h1 className="lg:text-[24px] lg:font-bold lg:leading-[40px]">{tLanding("signIn")}</h1>
          <h4 className="pt-[14px]  lg:pt-[21px]  pb-[18px] lg:pb-[38px] lg:text-[16px] lg:font-normal lg:leading-[30px] leading-6 lg:w-[348px]">
            {tLanding("signInDes")}
          </h4>
          <div className="flex flex-col">
            <label className=" text-gray4 cta2">{t("login.phoneNumber")}</label>
            <div dir="ltr" className="flex items-center gap-x-2 relative mt-2">
              <PhoneInput
                enableSearch={true}
                value={phoneNumber}
                onChange={handleOnChange}
                country={"ir"}
                excludeCountries={["il"]}
                inputStyle={{
                  width: "100%",
                  height: "40px",
                  padding: "14px",
                  paddingLeft: "52px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  borderColor: "#E8E8E8",
                }}
                buttonStyle={{
                  backgroundColor: "white",
                  borderTopLeftRadius: "8px",
                  borderBottomLeftRadius: "8px",
                  borderColor: "#E8E8E8",
                }}
                searchClass="!py-[10px] !px-2"
              />
              <div className="">
                <CustomButton
                  title={tLanding("sendLink")}
                  styleType="Primary"
                  size={"S"}
                  onClick={() => {
                    sendLink();
                  }}
                  bgColor="bg-white"
                  textColor="text-main2"
                  width="w-[90px] lg:w-[150px]"
                  isDisabled={!activeBtn}
                  isPointerEventsNone={!activeBtn}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
