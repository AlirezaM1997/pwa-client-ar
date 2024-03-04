import * as yup from "yup";
import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { accountsAction } from "@store/slices/accounts";
import { Subtitle, Mobile, Sms, Map } from "iconsax-react";
// FUNCTION
import { isNumberKey } from "@functions/isNumberKey";
// GQL
import { USER_EDIT_PROFILE } from "@services/gql/mutation/USER_EDIT_PROFILE";
import { ASSOCIATION_EDIT_PROFILE } from "@services/gql/mutation/ASSOCIATION_EDIT_PROFILE";
// COMPONENT
import PlainInput from "@components/kit/Input/PlainInput";
import CustomButton from "@components/kit/button/CustomButton";
import TextareaInput from "@components/kit/Input/TextareaInput";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const LocationInput = dynamic(() => import("@components/kit/Input/LocationInput"), {
  ssr: false,
});
const AddSinglePicture = dynamic(() => import("@components/common/AddSinglePicture"), {
  ssr: false,
});

const justNameMaxChar = 40;
const bioMaxChar = 1000;
const missionStatementMaxChar = 1000;
const addressMaxChar = 100;

export default function EditProfile({ data, t, tP, isAssociation, classNames }) {
  const accounts = useSelector((state) => state.accounts.accounts);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const isMobile = useWindowSize().width < 960;

  const [location, setLocation] = useState({
    lat: data?.location?.geo?.lat,
    lng: data?.location?.geo?.lon,
  });
  const [imageUrl, setImageUrl] = useState(data?.image);
  const [uploadLoading, setUploadLoading] = useState(false);

  ////////////////////FORM////////////////////
  const schema = yup.object({
    justName: yup.string().trim().max(justNameMaxChar).required(t("errorMessages.requiredField")),
    bio: yup.string().trim().max(bioMaxChar, tP("formErrors.bio")).notRequired(),
    missionStatement: yup
      .string()
      .trim()
      .max(missionStatementMaxChar, tP("formErrors.missionStatement"))
      .notRequired(),
    publicPhone: yup.string().trim().notRequired(),
    email: yup
      .string()
      .trim()
      .matches(
        // eslint-disable-next-line no-useless-escape
        /^$|^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        t("errorMessages.formErrors.email")
      )
      .notRequired(),
    address: yup
      .string()
      .trim()
      .max(addressMaxChar, t("errorMessages.formErrors.address"))
      .notRequired(),
  });

  const defaultValues = {
    justName: data?.justName,
    bio: data?.bio,
    missionStatement: data?.missionStatement,
    publicPhone: data?.publicPhone,
    email: data?.email,
    address: data?.location.address,
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    mode: "onBlur",
  });

  const [association_edit_profile_mutation] = useMutation(ASSOCIATION_EDIT_PROFILE);
  const [user_edit_profile_mutation] = useMutation(USER_EDIT_PROFILE);
  const onSubmit = async (formData) => {
    const variables = {
      data: {
        name: formData.justName,
        bio: formData.bio,
        missionStatement: formData.missionStatement,
        publicPhone: formData.publicPhone === "" ? null : formData.publicPhone,
        email: formData.email === "" ? null : formData.email,
        image: imageUrl || "",
        location: {
          address: formData.address,
          geo: location.lat
            ? {
                lat: location.lat,
                lon: location.lng,
              }
            : null,
        },
        roleSpeceficInformaton: {
          birthDate: null,
          gender: null,
          nationalCode: null,
        },
        deleteEmail: formData.email ? false : true,
        deletePublicPhone: formData.publicPhone ? false : true,
      },
    };
    if (isAssociation) {
      delete variables.data.roleSpeceficInformaton;
      try {
        const {
          data: { association_edit_profile },
        } = await association_edit_profile_mutation({
          variables,
        });
        if (association_edit_profile.status === 200) {
          dispatch(
            accountsAction({
              accounts: accounts.map((item) =>
                item._id !== token._id ? item : { ...item, name: formData.justName }
              ),
            })
          );
          setTimeout(() => {
            router.push("/my-profile", undefined, { shallow: true });
          }, 1000);
        }
      } catch (error) {
        toast.custom(() => <Toast text={t("errorMessages.serverErrorPageTitle")} status="ERROR" />);
      }
    } else {
      delete variables.data.missionStatement;
      delete variables.data.publicPhone;
      delete variables.data.email;
      // delete variables.data.image;
      delete variables.data.deleteEmail;
      delete variables.data.deletePublicPhone;
      try {
        const {
          data: { user_edit_profile },
        } = await user_edit_profile_mutation({
          variables,
        });
        if (user_edit_profile.status === 200) {
          dispatch(
            accountsAction({
              accounts: accounts.map((item) =>
                item._id !== token._id ? item : { ...item, name: formData.justName }
              ),
            })
          );
          setTimeout(() => {
            router.push("/my-profile", undefined, { shallow: true });
          }, 1000);
        }
      } catch (error) {
        toast.custom(() => <Toast text={t("errorMessages.serverErrorPageTitle")} status="ERROR" />);
      }
    }
  };

  const { justName, bio, missionStatement, email, address } = watch();

  const bioMaxCharError = bio ? (bio.length > bioMaxChar ? tP("formErrors.bio") : "") : "";
  const missionStatementMaxCharError = missionStatement
    ? missionStatement.length > missionStatementMaxChar
      ? tP("formErrors.missionStatement")
      : ""
    : "";

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={classNames}>
        <div className="relative">
          <AddSinglePicture
            t={t}
            classNames="mb-[32px]"
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            setUploadLoading={setUploadLoading}
            uploadLoading={uploadLoading}
          />
        </div>
        <PlainInput
          labelText={tP("displayName")}
          icon={<Subtitle size={13} />}
          placeholder={tP("displayName")}
          isDisable={!!data?.hasAction}
          register={{ ...register("justName") }}
          errorText={errors.justName?.message}
          characterCount={justName?.length}
          maxLength={40}
          showMaxLengthLabel={true}
          t={t}
        />
        <TextareaInput
          register={{ ...register("bio") }}
          errorText={bioMaxCharError}
          labelText={t("description")}
          icon={<Subtitle size={13} />}
          characterCount={bio?.length}
          maxLength={bioMaxChar}
          showMaxLengthLabel={true}
        />
        {isAssociation && (
          <TextareaInput
            t={t}
            register={{ ...register("missionStatement") }}
            errorText={missionStatementMaxCharError}
            labelText={t("association-profile.missionStatement")}
            icon={<Subtitle size={13} />}
            characterCount={missionStatement?.length}
            maxLength={missionStatementMaxChar}
            showMaxLengthLabel={true}
          />
        )}
        {isAssociation && (
          <>
            <PlainInput
              labelText={tP("phoneNumber")}
              icon={<Mobile size={13} />}
              placeholder={t("write")}
              register={{ ...register("publicPhone") }}
              errorText={errors.publicPhone?.message}
              type={isMobile ? "number" : "text"}
              onKeyDown={isNumberKey}
            />
            <PlainInput
              maxLength="100"
              showMaxLengthLabel
              labelText={tP("email")}
              icon={<Sms size={13} />}
              placeholder={tP("emailP")}
              characterCount={email?.length}
              errorText={errors.email?.message}
              register={{ ...register("email") }}
            />
          </>
        )}
        <PlainInput
          maxLength="100"
          showMaxLengthLabel
          labelText={t("address")}
          icon={<Map size={13} />}
          placeholder={t("write")}
          characterCount={address?.length}
          errorText={errors.address?.message}
          register={{ ...register("address") }}
        />
        <LocationInput
          t={t}
          value={location}
          setValue={setLocation}
          buttonTitle={t("confirmLocation")}
        />
        <div className="pt-[35px]">
          <CustomButton
            isFullWidth={true}
            title={t("confirm")}
            type="submit"
            size="M"
            isDisabled={uploadLoading}
            isPointerEventsNone={uploadLoading}
          />
        </div>
      </form>
    </>
  );
}
