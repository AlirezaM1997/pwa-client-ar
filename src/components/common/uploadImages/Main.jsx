import toast from "react-hot-toast";
import NextImage from "next/legacy/image";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { AddCircle, Camera } from "iconsax-react";
import { useWindowSize } from "@uidotdev/usehooks";
// HOOK
import useMultiImageToBase64 from "@hooks/useMultiImageToBase64";
//FUNCTION
import { getIndexById } from "@functions/getIndexById";
import { handleMainPicture } from "@functions/handleMainPicture";
//GQL
import { UPLOAD_IMAGE_BASE64 } from "@services/gql/mutation/UPLOAD_IMAGE_BASE64";
//COMPONENT
import dynamic from "next/dynamic";
import Loading from "@components/kit/loading/Loading";
import AddPicture from "./AddPicture";
import PictureSetting from "./PictureSetting";
import CustomTransitionModal from "@components/kit/modal/CustomTransitionModal";
//COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const SingleImageViewer = dynamic(() => import("../SingleImageViewer"), { ssr: false });
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });

export default function UploadImages({
  isInProject,
  setImagesUrl,
  imagesUrl,
  setUploadLoading,
  uploadLoading,
}) {
  //VARIABLE
  const { t } = useTranslation();
  const size = useWindowSize();
  const [openAddPicture, setOpenAddPicture] = useState(false);
  const [openPictureSetting, setOpenPictureSetting] = useState(false);
  const [openPictureView, setOpenPictureView] = useState(false);
  const [pictureData, setPictureData] = useState(null);
  const [currentPictureSetting, setCurrentPictureSetting] = useState({
    url: "",
    id: null,
    isMainPicture: false,
  });

  //FUNCTION
  const controller = new AbortController();
  const [upload_base64] = useMutation(UPLOAD_IMAGE_BASE64, {
    context: {
      fetchOptions: {
        signal: controller.signal,
      },
    },
  });

  const { base64Images, handleImageChange, overMaxSize, setOverMaxSize } = useMultiImageToBase64();

  useEffect(() => {
    if (!!base64Images && !overMaxSize) {
      uploadAllImages(base64Images);
    }
    if (overMaxSize) {
      setOpenAddPicture(false);
      toast.custom(() => <Toast text={t("uploadOverSize")} status="ERROR" />);
      setOverMaxSize(false);
    }
  }, [base64Images, overMaxSize]);

  const addPictureFromGallery = (e) => {
    document.getElementById("selectImage").click();
  };

  const uploadMutation = async (base64) => {
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
        return upload_image_base64.url;
      }
    } catch (error) {
      return "error";
    }
  };

  const uploadAllImages = async (base64Images) => {
    setOpenAddPicture(false);
    setUploadLoading(true);
    const uploadedImages = await base64Images.map(async (base64) => await uploadMutation(base64));
    Promise.all(uploadedImages).then((res) => {
      if (res.some((item) => item === "error")) {
        const _allPictures = imagesUrl;
        setImagesUrl(_allPictures);
        setUploadLoading(false);
        toast.custom(() => <Toast text={t("uploadUnsuccessful")} status="ERROR" />);
        controller.abort();
      } else {
        setImagesUrl([
          ...imagesUrl,
          ...res.map((str, index) => ({
            url: str,
            id: (Math.random() + 1).toString(16).slice(2),
            isMainPicture: handleMainPicture(index, imagesUrl?.length),
          })),
        ]);
        setUploadLoading(false);
      }
    });
  };

  const deletePicture = (id) => {
    const _imagesUrl = [...imagesUrl];
    const indexOfImageFile = getIndexById(_imagesUrl, id);
    if (indexOfImageFile !== -1) {
      if (_imagesUrl[indexOfImageFile].isMainPicture) {
        _imagesUrl.splice(indexOfImageFile, 1);
        if (_imagesUrl.length !== 0) {
          _imagesUrl[0].isMainPicture = true;
        }
      } else {
        _imagesUrl.splice(indexOfImageFile, 1);
      }
      setImagesUrl(_imagesUrl);
      setOpenPictureSetting(false);
    }
  };

  const seePicture = (imageData) => {
    setOpenPictureView(true);
    setPictureData(imageData);
    setOpenPictureSetting(false);
  };

  const setAsMainPicture = (id) => {
    const _imagesUrl = [...imagesUrl];
    const indexOfObject = getIndexById(_imagesUrl, id);
    if (indexOfObject !== -1) {
      _imagesUrl.map((i) => (i.isMainPicture = false));
      _imagesUrl[indexOfObject].isMainPicture = true;
      setImagesUrl(_imagesUrl);
      setOpenPictureSetting(false);
    }
  };

  useEffect(() => {
    let timer;
    if (uploadLoading) {
      timer = setTimeout(() => {
        const _allPictures = imagesUrl;
        setImagesUrl(_allPictures);
        setUploadLoading(false);
        controller.abort();
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
        <div className="absolute left-0 top-0 w-full">
          <Loading loadingHeight={size.width > 960 ? "70px" : "200px"} />
        </div>
      )}
      <div
        className={`grid grid-cols-4 gap-x-[15px] gap-y-[18px] lg:flex lg:flex-row lg:gap-[38px] ${
          uploadLoading ? "blur-[4px]" : ""
        }`}
      >
        <div
          onClick={() =>
            imagesUrl.length < 7
              ? setOpenAddPicture(true)
              : toast.custom(() => (
                  <Toast text={t("addPicture.imposibleAddPicture")} status="WARNING" />
                ))
          }
          className="relative w-[70px] h-[70px] border-dashed border-[1px] rounded-lg flex items-center justify-center cursor-pointer"
        >
          <Camera size={32} />
          <AddCircle variant="Bold" size={26} className="absolute -right-[10px] -bottom-[10px]" />
        </div>
        {imagesUrl.slice(0, 7).map((item, _index) => (
          <div
            key={_index}
            onClick={() => {
              setOpenPictureSetting(true);
              setCurrentPictureSetting(item);
            }}
            className="relative w-[70px] h-[70px] border-dashed border-[1px] border-gray5 rounded-lg flex items-center justify-center overflow-hidden"
          >
            <NextImage
              src={item.url}
              layout="fill"
              objectFit="cover"
              alt={"img"}
              className="cover-center-img"
            ></NextImage>
            {item.isMainPicture && (
              <div className="h-[22px] w-full z-10 text-[10px] leading-[18px] font-medium bg-[#2E2E2E80] text-white flex items-center justify-center self-end">
                {t("addPicture.mainPicture")}
              </div>
            )}
          </div>
        ))}
        {imagesUrl.length < 8 &&
          Array.from({ length: 7 - imagesUrl.length }).map((item, _index) => (
            <div
              key={_index}
              className="relative w-[70px] h-[70px] border-dashed border-[1px] border-gray5 rounded-lg flex items-center justify-center"
            >
              <Camera size={32} variant="Bold" color="#C7C7C7" />
            </div>
          ))}
      </div>

      {size.width < 960 ? (
        <>
          <BottomSheet open={openAddPicture} setOpen={setOpenAddPicture}>
            <AddPicture
              t={t}
              handleImageChange={handleImageChange}
              addPictureFromGallery={addPictureFromGallery}
            />
          </BottomSheet>
          <BottomSheet open={openPictureSetting} setOpen={setOpenPictureSetting}>
            <PictureSetting
              t={t}
              currentPictureSetting={currentPictureSetting}
              setAsMainPicture={setAsMainPicture}
              deletePicture={deletePicture}
              seePicture={seePicture}
            />
          </BottomSheet>
        </>
      ) : (
        <>
          <CustomTransitionModal
            open={openAddPicture}
            close={() => setOpenAddPicture(false)}
            width="500px"
          >
            <AddPicture
              t={t}
              handleImageChange={handleImageChange}
              addPictureFromGallery={addPictureFromGallery}
            />
          </CustomTransitionModal>
          <CustomTransitionModal
            open={openPictureSetting}
            close={() => setOpenPictureSetting(false)}
            width="500px"
          >
            <PictureSetting
              t={t}
              currentPictureSetting={currentPictureSetting}
              setAsMainPicture={setAsMainPicture}
              deletePicture={deletePicture}
              seePicture={seePicture}
            />
          </CustomTransitionModal>
        </>
      )}

      <SingleImageViewer
        open={openPictureView}
        setOpen={setOpenPictureView}
        url={pictureData?.url}
        setUrl={setPictureData}
        title={isInProject ? t("createProject") : t("createRequest")}
      />
    </>
  );
}
