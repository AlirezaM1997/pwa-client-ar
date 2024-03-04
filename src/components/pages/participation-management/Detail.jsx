import { getCookie } from "cookies-next";
import { useMutation } from "@apollo/client";
import { CloseCircle, Refresh2, TickCircle } from "iconsax-react";
//FUNCTION
import { getDate } from "@functions/getDate";
//GQL
import { ASSOCIATION_APPROVE_PARTICIPATION } from "@services/gql/mutation/ASSOCIATION_APPROVE_PARTICIPATION";
import { ASSOCIATION_DISAPPROVE_PARTICIPATION } from "@services/gql/mutation/ASSOCIATION_DISAPPROVE_PARTICIPATION";
//COMPONENT
import dynamic from "next/dynamic";
import CustomButton from "@components/kit/button/CustomButton";
// COMPONENT DYNAMIC IMPORT
const TopOfCard = dynamic(() => import("./TopOfCard"), { ssr: false });

export default function Detail({
  t,
  data,
  tPM,
  setOpen,
  setData
}) {
  const lang = getCookie("NEXT_LOCALE");
  const [approve_participation] = useMutation(ASSOCIATION_APPROVE_PARTICIPATION);

  const approve = async () => {
    try {
      const {
        data: { association_approve_participation },
      } = await approve_participation({
        variables: {
          participationId: data._id,
        },
      });
      if (association_approve_participation.status === 200) {
        setData({ ...data, status: "APPROVED" });
        setOpen(false);
        document.body.style.overflow = "unset";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [disapprove_participation] = useMutation(ASSOCIATION_DISAPPROVE_PARTICIPATION);
  const disapprove = async () => {
    try {
      const {
        data: { association_disapprove_participation },
      } = await disapprove_participation({
        variables: {
          participationId: data._id,
        },
      });
      if (association_disapprove_participation.status === 200) {
        setData({ ...data, status: "REJECTED" });
        setOpen(false);
        document.body.style.overflow = "unset";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const statusobj = {
    APPROVED: {
      name: tPM("approved"),
      svg: <TickCircle size={20} color="#43936C" variant="Bold" />,
    },
    REJECTED: {
      name: tPM("reject"),
      svg: <CloseCircle size={20} color="#CB3A31" variant="Bold" />,
    },
    PENDING: {
      name: tPM("pend"),
      svg: <Refresh2 size={20} color="#FF8800" variant="Outline" />,
    },
  };

  return (
    <div className="flex flex-col px-4 pb-6 lg:p-[25px]">
      <TopOfCard
        t={t}
        data={data}
        tPM={tPM}
        participator={data?.participator?.name}
        participatorImage={data?.participator?.image}
        lang={lang}
        useInModal={true}
      />

      <div className="flex flex-row w-full justify-between items-center mt-4">
        <div className="flex flex-row w-full">
          <p className="caption2 text-gray2"></p>
          <p className="caption2 text-gray2 px-1">{getDate(data.createdAt, lang)}</p>
        </div>
        <div className="flex flex-row items-center gap-[7px]">
          <span
            className={`${
              data?.status === "APPROVED" || data?.type === "FINANCIAL"
                ? "text-[#43936C]"
                : data?.status === "REJECTED"
                ? "text-[#CB3A31]"
                : "text-[#FF8800]"
            } caption5 leading-[26px] w-max`}
          >
            {data?.type === "FINANCIAL" ? statusobj["APPROVED"].name : statusobj[data?.status]?.name}
          </span>
          <span>
            {data?.type === "FINANCIAL" ? statusobj["APPROVED"].svg : statusobj[data?.status]?.svg}
          </span>
        </div>
      </div>

      {data?.description && (
        <p className="w-full mt-[6px] max-h-[250px] overflow-y-auto ltr:pr-4 rtl:pl-4 lg:mt-[11px] break-words">
          {data.description}
        </p>
      )}

      {data?.type === "FINANCIAL" && (
        <div className="flex flex-row justify-start mt-[6px]">
          <p className="text-gray3 caption2">{tPM("depositAmount")}</p>
          <p className="text-gray3 caption2 px-3">{"."}</p>
          <p className="text-main2 heading ">
            {Number(data?.amount).toLocaleString()} {t("toman")}
          </p>
        </div>
      )}

      {data?.status === "PENDING" && data?.type !== "FINANCIAL" && (
        <div className="flex flex-row w-full justify-between gap-[20px] mt-[21px]">
          <CustomButton
            onClick={() => {
              approve();
            }}
            size="S"
            title={tPM("confirmDonate")}
            width={"w-[48%]"}
          />
          <CustomButton
            onClick={() => {
              disapprove();
            }}
            size="S"
            title={tPM("rejectDonate")}
            width={"w-[48%]"}
            styleType={"Secondary"}
            borderColor={"border-gray1"}
            bgColor={"bg-white"}
            textColor={"text-gray1"}
          />
        </div>
      )}
    </div>
  );
}
