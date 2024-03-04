export default function AddPicture({ t, handleImageChange, addPictureFromGallery }) {
  return (
    <>
      <div className="px-[18px] pb-[14px] lg:p-5">
        <h1 className={`heading`}>{t("addPicture.choosePicture")}</h1>
        <input
          type="file"
          name=""
          id="selectImage"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageChange(e, t)}
          multiple={true}
        />
        <button
          className="caption4 text-gray1 w-full rtl:text-right ltr:text-left my-5"
          onClick={() => addPictureFromGallery()}
        >
          {t("addPicture.fromGallery")}
        </button>
      </div>
    </>
  );
}
