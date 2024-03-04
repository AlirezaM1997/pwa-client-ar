import toast from "react-hot-toast";
import NextImage from "next/legacy/image";
import { useMutation } from "@apollo/client";
import { useState, useRef, useEffect } from "react";
import { CloseCircle, Camera, Edit2 } from "iconsax-react";
import Image from "next/image";
//HOOK
import useImageToBase64 from "@hooks/useImageToBase64";
//GQL
import { UPLOAD_IMAGE_BASE64 } from "@services/gql/mutation/UPLOAD_IMAGE_BASE64";
//COMPONENT
import dynamic from "next/dynamic";
import Loading from "@components/kit/loading/Loading";
import CustomButton from "@components/kit/button/CustomButton";
//COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });

export default function AddSinglePicture({
  t,
  classNames,
  imageUrl,
  setImageUrl,
  setUploadLoading,
  uploadLoading,
}) {
  //VARIABLE
  const fileInputRef = useRef(null);
  const [openAddPicture, setOpenAddPicture] = useState(false);
  const [openPictureSetting, setOpenPictureSetting] = useState(false);
  const [openPictureView, setOpenPictureView] = useState(false);
  const controller = new AbortController();

  const [upload_base64] = useMutation(UPLOAD_IMAGE_BASE64, {
    ignoreResults: true,
  });
  const { base64Image, handleImageChange, overMaxSize, setOverMaxSize } = useImageToBase64();

  //FUNCTION
  const uploadMutation = async (base64) => {
    setOpenAddPicture(false);
    setUploadLoading(true);
    try {
      const {
        data: { upload_image_base64 },
      } = await upload_base64({
        variables: {
          image: {
            base64,
            name: (Math.random() + 1).toString(36).substring(3),
          },
        },
      });
      if (upload_image_base64.url) {
        setUploadLoading(false);
        setImageUrl(upload_image_base64.url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addPictureFromGallery = (e) => {
    fileInputRef.current.click();
  };

  const deletePicture = () => {
    setImageUrl(null);
    setOpenPictureSetting(false);
  };

  const seePicture = () => {
    setOpenPictureView(true);
    setOpenPictureSetting(false);
  };

  useEffect(() => {
    if (!!base64Image) {
      uploadMutation(base64Image);
    }
    if (overMaxSize) {
      setOpenAddPicture(false);
      toast.custom(() => <Toast text={t("uploadOverSize")} status="ERROR" />);
      setOverMaxSize(false);
    }
  }, [base64Image, overMaxSize]);

  useEffect(() => {
    let timer;
    if (uploadLoading) {
      timer = setTimeout(() => {
        controller.abort();
        setUploadLoading(false);
        toast.custom(() => <Toast text={t("uploadUnsuccessful")} status="ERROR" />);
      }, 60000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [uploadLoading]);

  //JSX
  return (
    <>
      {uploadLoading && (
        <div className="absolute left-0 top-0 z-10 w-full">
          <Loading loadingHeight={"176px"} loadingWidth="w-full" />
        </div>
      )}
      <div
        className={`flex flex-col items-center ${classNames} ${uploadLoading ? "opacity-50" : ""}`}
      >
        {imageUrl ? (
          <div className="icon relative w-[103px] h-[103px] border-dashed border-[1px] border-gray5 rounded-full flex items-center justify-center overflow-hidden mb-[10px]">
            <NextImage src={imageUrl} layout="fill" objectFit="cover" alt="img" />
          </div>
        ) : (
          <div className="icon bg-gray5 relative w-[103px] h-[103px] border-dashed rounded-full flex items-center justify-center mb-[10px]">
            <Camera width={"320px"} height={"100px"} />
          </div>
        )}
        <CustomButton
          icon={<Edit2 size={16} />}
          onClick={imageUrl ? () => setOpenPictureSetting(true) : () => setOpenAddPicture(true)}
          bgColor="bg-main2"
          title={imageUrl ? t("addPicture.editPicture") : t("addPicture.choosePicture")}
          width="w-[151px]"
        />

        <div className="flex flex-row text-[10px] leading-[22px] font-normal text-gray2 mt-[7px]">
          (<span>{t("addPicture.maxSize")}</span>
          <span>25MB</span>)
        </div>
      </div>

      <BottomSheet open={openAddPicture} setOpen={setOpenAddPicture}>
        <div className="px-[18px] pb-[14px]">
          <h1 className={`heading`}>{t("addPicture.choosePicture")}</h1>
          <input type="file" className="hidden" onChange={handleImageChange} ref={fileInputRef} />
          <button
            className="caption4 text-gray1 w-full rtl:text-right ltr:text-left my-5"
            onClick={() => addPictureFromGallery()}
          >
            {t("addPicture.fromGallery")}
          </button>
        </div>
      </BottomSheet>
      <BottomSheet open={openPictureSetting} setOpen={setOpenPictureSetting}>
        <div className="px-[18px] pb-[14px]">
          <h1 className={`heading`}>{t("addPicture.pictureSetting")}</h1>
          <button
            className="caption4 text-gray1 w-full rtl:text-right ltr:text-left my-5"
            onClick={() => deletePicture()}
          >
            {t("addPicture.deletePicture")}
          </button>
          <button
            className="caption4 text-gray1 w-full rtl:text-right ltr:text-left"
            onClick={() => seePicture()}
          >
            {t("addPicture.seePicture")}
          </button>
        </div>
      </BottomSheet>
      <ModalScreen
        open={openPictureView}
        close={() => {
          setOpenPictureView(false);
          document.body.style.overflow = "unset";
        }}
      >
        <div className="px-2 h-screen flex flex-col items-center pt-[40px] bg-black">
          <div
            className=" absolute top-[40px] right-5"
            onClick={() => {
              setOpenPictureView(false);
              document.body.style.overflow = "unset";
            }}
          >
            <CloseCircle variant="Bold" color="#FFFFFF" />
          </div>
          <h4 className=" text-white title1">{t("addPicture.seePicture")}</h4>
          <div className=" relative m-auto center-iamge-in-modal">
            {imageUrl && (
              <div className="unset-img">
                <Image alt="profile-image" src={imageUrl} layout="fill" className="custom-img" />
              </div>
            )}
          </div>
        </div>
      </ModalScreen>
    </>
  );
}
