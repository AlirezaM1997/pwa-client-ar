import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
// GQL
import { REPORT } from "@services/gql/mutation/REPORT";
// COMPONENT
import CustomButton from "@components/kit/button/CustomButton";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const Login = dynamic(() => import("@components/common/login/Main"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });

export default function ViolationReportBottomSheet({
  t,
  setOpenViolationReportBottomSheet,
  openViolationReportBottomSheet,
  targetId,
  targetType,
}) {
  const router = useRouter();
  const array = [
    { name: t("reportTags.blasphemy"), value: "BLASPHEMY" },
    { name: t("reportTags.spam"), value: "SPAM" },
    { name: t("reportTags.scam"), value: "SCAM" },
    { name: t("reportTags.falseInformation"), value: "FALSIFICATION" },
    { name: t("reportTags.danger"), value: "DANGER" },
    { name: t("other"), value: "OTHER" },
  ];
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  const handleCheckBox = (e, item) => {
    if (e.target.checked) {
      setTags([
        ...tags,
        {
          name: item.name,
          value: item.value,
        },
      ]);
    } else {
      setTags(tags.filter((i) => i.value !== item.value));
    }
  };
  //////////////////////////////////////////
  const [report_mutation] = useMutation(REPORT);
  const sendReport = async () => {
    const variables = {
      data: {
        tags: tags.map((i) => i.value),
        targetId,
        targetType,
        text,
      },
    };
    try {
      const {
        data: { report },
      } = await report_mutation({
        variables,
      });
      if (report.status === 200) {
        setOpenViolationReportBottomSheet(false);
        setText("");
        setTags([]);
        toast.custom(() => <Toast text={t("successfulReportToast")} />);
      }
    } catch (error) {
      if (error.message === "Authorization failed" || error.message === "Token required") {
        setOpenViolationReportBottomSheet(false);
        setShowLogin(true);
      }
    }
  };
  return (
    <>
      <BottomSheet
        open={openViolationReportBottomSheet}
        setOpen={setOpenViolationReportBottomSheet}
      >
        <div className="px-4 pb-6">
          <h1 className="titleInput pb-[6px]">{t("violationReport")}</h1>
          {array.map((item, index) => (
            <div className={`flex items-center py-[17px]`} key={index}>
              <input
                id={index * 3}
                type="checkbox"
                name={item.name}
                value={item.name}
                onChange={(e) => handleCheckBox(e, item)}
                className="w-[13px] h-[13px]"
              />
              <label htmlFor={index * 3} className="rtl:mr-[17px] ltr:ml-[17px]">
                {item.name}
              </label>
            </div>
          ))}
          <div className="mt-4 mb-5">
            <textarea
              rows={5}
              className="w-full rounded-lg border-[1px] border-gray2 outline-none py-[11px] px-[14px] text-[14px] font-normal leading-[22px] placeholder:text-gray1"
              placeholder={t("violationReportPlaceholder")}
              value={text}
              onChange={(e) => setText(e.target.value.replace(/^\s+/, ""))}
              maxLength={500}
            />
          </div>
          <CustomButton
            isFullWidth={true}
            title={t("sendReport")}
            onClick={() => {
              sendReport();
            }}
            size="S"
          />
        </div>
      </BottomSheet>
      {showLogin && (
        <ModalScreen open={showLogin}>
          <Login setShowLogin={setShowLogin} modalMode={true} t={t} landingRoute={router.asPath} />
        </ModalScreen>
      )}
    </>
  );
}
