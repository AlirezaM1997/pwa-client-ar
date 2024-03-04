import Image from "next/legacy/image";
import { useRouter } from "next/router";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

export default function SuggestLoginAfterParticipation({ t }) {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col items-center px-4 lg:px-[52px] py-6">
        <div className={`w-[172px] h-[237px]  relative`}>
          <Image src={"/assets/images/offer-to-login-modal.png"} layout="fill" alt={"mark"}></Image>
        </div>
        <h1 className="my-[40px] heading text-center">{t("project-profile.suggestLogin")}</h1>

        <div className="flex gap-x-[10px] w-full">
          <CustomButton
            title={t("project-profile.seeOtherProjects")}
            onClick={() => router.push("/", undefined, { shallow: true })}
            isFullWidth={true}
            size="M"
            styleType="Secondary"
            textColor="text-[#03A6CF]"
          />
          <CustomButton
            title={t("project-profile.loginRegister")}
            onClick={() => router.push("/login", undefined, { shallow: true })}
            isFullWidth={true}
            size="M"
          />
        </div>
      </div>
    </>
  );
}
