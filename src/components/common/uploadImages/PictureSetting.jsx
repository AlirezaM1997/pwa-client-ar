export default function PictureSetting({
  t,
  currentPictureSetting,
  setAsMainPicture,
  deletePicture,
  seePicture,
}) {
  return (
    <>
      <div className="px-[18px] pb-[14px] lg:p-5">
        <h1 className={`heading`}>{t("addPicture.pictureSetting")}</h1>
        {!currentPictureSetting.isMainPicture && (
          <button
            className="caption4 text-gray1 w-full rtl:text-right ltr:text-left mt-5"
            onClick={() => setAsMainPicture(currentPictureSetting?.id)}
          >
            {t("addPicture.setAsMainPicture")}
          </button>
        )}
        <button
          className="caption4 text-gray1 w-full rtl:text-right ltr:text-left my-5"
          onClick={() => deletePicture(currentPictureSetting?.id)}
        >
          {t("addPicture.deletePicture")}
        </button>
        <button
          className="caption4 text-gray1 w-full rtl:text-right ltr:text-left"
          onClick={() => seePicture(currentPictureSetting)}
        >
          {t("addPicture.seePicture")}
        </button>
      </div>
    </>
  );
}
