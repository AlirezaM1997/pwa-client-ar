import Image from "next/legacy/image";
import CustomButton from "@components/kit/button/CustomButton";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { saveToStorage } from "@functions/saveToStorage";

const lookup = {
  FINANCIAL: 1,
  MORAL: 2,
  IDEAS: 3,
  CAPACITY: 4,
  PRESSENCE: 5,
  SKILL: 6,
};

export default function ParticipationStatus({
  t,
  isOk,
  openShareModal,
  closeThisModal,
  typeOfParticipation = "FINANCIAL",
  projectId,
}) {
  const currentUserId = useSelector((state) => state.token._id);
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center p-4">
        <div className={`w-[216px] h-[230px] relative`}>
          <Image src={"/assets/images/participation-modal.png"} layout="fill" alt={"mark"}></Image>
        </div>
        {isOk && (
          <h1 className="mt-[6px] heading leading-[30px]">
            {t("project-profile.modaAfterParticipationTitle")}
          </h1>
        )}
        <h5 className="mt-[6px] mb-[30px] text-gray2 caption1">
          {isOk
            ? t("project-profile.modaAfterSuccessParticipationDes")
            : t("project-profile.modaAfterUnsuccessParticipationDes")}
        </h5>
        <CustomButton
          title={
            isOk ? t("project-profile.inviteFriends") : t("project-profile.participationAgain")
          }
          size={"M"}
          isFullWidth={true}
          onClick={
            isOk
              ? openShareModal
              : () => {
                  saveToStorage("participationResult", null);
                  typeOfParticipation === "FINANCIAL"
                    ? router.push(`/participation/${projectId}?tab=${lookup[typeOfParticipation]}`)
                    : router.back();
                }
          }
        />
        {!currentUserId && (
          <Link href={"/login"} onClick={closeThisModal} className="mt-[6px] text-main2 cta2">
            {t("project-profile.notYetRegister")}
          </Link>
        )}
      </div>
    </>
  );
}
