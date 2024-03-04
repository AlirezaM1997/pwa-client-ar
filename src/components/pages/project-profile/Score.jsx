import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { WhiteStar, YellowStar } from "@lib/svg";
import StarRatingComponent from "react-star-rating-component";
// GQL
import { RATE_PROJECT } from "@services/gql/mutation/RATE_PROJECT";
// COMPONENT
import CustomButton from "@components/kit/button/CustomButton";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });

export default function Score({ setOpen, data, refetch, t }) {
  const [rate, setRate] = useState(0);
  const [rateProject] = useMutation(RATE_PROJECT);

  const handleRate = async () => {
    try {
      const {
        data: { rate_project },
      } = await rateProject({
        variables: {
          data: {
            rate: rate,
            projectId: data?._id,
          },
        },
      });
      if (rate_project.status === 200) {
        toast.custom(() => <Toast text={t("project-profile.successfullScore")} />);
        refetch();
        setTimeout(() => {
          setOpen(false);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col px-4 pb-5 pt-1">
      <p className="heading text-black">{t("score")}</p>
      <p className="caption1 text-black pt-1">{t("project-profile.sendScore")}</p>
      <div className="starIconClass flex items-center justify-center py-6">
        <StarRatingComponent
          name="rate1"
          value={rate}
          starCount={5}
          onStarClick={(nextValue, _, __) => setRate(nextValue)}
          renderStarIcon={(nextValue, prevValue, __) => {
            return (
              <span>
                {nextValue <= prevValue ? (
                  <div className="mx-[16px]">
                    <YellowStar h={28} w={28} />
                  </div>
                ) : (
                  <div className="mx-[16px]">
                    <WhiteStar h={28} w={28} />
                  </div>
                )}
              </span>
            );
          }}
        />
      </div>
      <CustomButton
        onClick={() => {
          handleRate();
          setOpen(false);
        }}
        size="S"
        title={t("confirm")}
        width={"w-[100%]"}
        styleType={"Primary"}
        borderColor={rate === 0 ? "border-gray5" : "border-main2"}
        bgColor={rate === 0 ? "bg-gray5" : "bg-main2"}
        textColor={rate === 0 ? "text-gray4" : "text-white"}
      />
    </div>
  );
}
