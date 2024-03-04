import { useState } from "react";
import dynamic from "next/dynamic";
import { useMutation } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import { CloseCircle, Refresh2, TickCircle } from "iconsax-react";
import { useRouter } from "next/router";
// GQL
import { ASSOCIATION_MODIFY_PROJECT } from "@services/gql/mutation/ASSOCIATION_MODIFY_PROJECT";
// COMPONENT
import CustomButton from "@components/kit/button/CustomButton";
// COMPONENT DYNAMIC IMPORT
const CustomModal = dynamic(() => import("@components/kit/modal/CustomModal"), { ssr: false });

export default function ProjectStatus({
  t,
  tPM,
  status = "PENDING",
  projectId,
  refetch,
  isRequest = false,
}) {
  const router = useRouter();
  ////////////////////STATES////////////////////
  const [openPauseProjectModal, setOpenPauseProjectModal] = useState(false);
  const [openArchiveProjectModal, setOpenArchiveProjectModal] = useState(false);
  const size = useWindowSize();

  ////////////////////FUNCTIONS////////////////////
  const generateTitleBasedStatus = (status) => {
    const lookup = {
      PENDING: (
        <div className="flex items-center gap-x-[9px]">
          <Refresh2 size={size.width < 960 ? 18 : 22} />
          <p className="">{tPM("pending")}</p>
        </div>
      ),
      REJECTED: (
        <div className="flex items-center gap-x-[9px]">
          <CloseCircle size={size.width < 960 ? 18 : 22} variant="Bold" color="#CB3A31" />
          <p className="text-danger">{tPM("rejected")}</p>
        </div>
      ),
      ACTIVE: (
        <div className="flex items-center gap-x-[9px]">
          <TickCircle size={size.width < 960 ? 18 : 22} variant="Bold" color="#43936C" />
          <p className="text-success">{tPM("active")}</p>
        </div>
      ),
      SUSPENDED: <p className="text-">{tPM("")}</p>,
      PAUSEDBYUSER: <p className="text-">{tPM("paused")}</p>,
      ARCHIVED: <p className="text-">{tPM("archive")}</p>,
    };
    const result = lookup[status];
    return result;
  };

  const generateDescriptionBasedStatus = (status) => {
    const lookup = {
      PENDING: isRequest ? tPM("requestPendingDes") : tPM("projectPendingDes"),
      REJECTED: isRequest ? tPM("requestRejectedDes") : tPM("projectRejectedDes"),
      ACTIVE: isRequest ? tPM("activeDesRequest") : tPM("activeDes"),
      SUSPENDED: tPM(""),
      PAUSEDBYUSER: tPM("pausedDes"),
      ARCHIVED: tPM("archiveDes"),
    };
    const result = lookup[status];
    return result;
  };

  const [modify_project] = useMutation(ASSOCIATION_MODIFY_PROJECT);
  const modifyProject = async (status) => {
    try {
      const {
        data: { association_modify_project },
      } = await modify_project({
        variables: {
          projectId,
          modifyStatusData: {
            reason: null,
            status,
          },
        },
      });
      if (association_modify_project.status === 200) {
        setOpenPauseProjectModal(false);
        setOpenArchiveProjectModal(false);
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full justify-between">
      <div className="flex flex-col">
        <div className="heading lg:text-[26px]">{generateTitleBasedStatus(status)}</div>
        <p className="pt-2 pb-4 caption2 lg:font-normal lg:pt-5">
          {generateDescriptionBasedStatus(status)}
        </p>
        {(status === "ACTIVE" || status === "PAUSEDBYUSER") && (
          <div className="flex items-center gap-x-[10px]">
            <CustomButton
              size={size.width < 960 ? "S" : "M"}
              title={status === "ACTIVE" ? tPM("pauseProject") : t("continue")}
              styleType={status === "ACTIVE" ? "Primary" : "Secondary"}
              onClick={() => {
                status === "ACTIVE" ? setOpenPauseProjectModal(true) : modifyProject("ACTIVE");
              }}
              borderColor={"border-gray2"}
              textColor={status === "ACTIVE" ? "text-white" : "text-gray2"}
              width={size.width < 960 ? "w-full" : "w-[152px]"}
            />
            <CustomButton
              title={tPM("archive")}
              styleType="Primary"
              size={size.width < 960 ? "S" : "M"}
              onClick={() => {
                setOpenArchiveProjectModal(true);
              }}
              width={size.width < 960 ? "w-full" : "w-[152px]"}
            />
          </div>
        )}
        {status === "REJECTED" && (
          <CustomButton
            title={tPM("reviewRequest")}
            styleType="Primary"
            size={size.width < 960 ? "S" : "M"}
            onClick={() => {
              router.push(`/edit-form/${projectId}`, undefined, { shallow: true });
            }}
            width={size.width < 960 ? "w-full" : "w-[152px]"}
          />
        )}
        <CustomModal
          title={tPM("pauseProject")}
          description={<>{tPM("pauseProjectMessage1")}</>}
          openState={openPauseProjectModal}
          cancelOnClick={() => setOpenPauseProjectModal(false)}
          hasOneButton={false}
          okOnClick={() => modifyProject("PAUSEDBYUSER")}
        />
        <CustomModal
          title={tPM("archiveProject")}
          description={<>{tPM("archiveProjectMessage1")}</>}
          openState={openArchiveProjectModal}
          cancelOnClick={() => setOpenArchiveProjectModal(false)}
          hasOneButton={false}
          okOnClick={() => modifyProject("ARCHIVED")}
        />
      </div>
    </div>
  );
}
