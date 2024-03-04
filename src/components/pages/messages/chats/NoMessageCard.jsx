import Image from "next/legacy/image";

export const NoMessageCard = ({ t }) => {
    return (
        <section
            className="flex w-full border-b-[1px] border-gray6 rounded-lg lg:rounded-none py-4 px-3 gap-4 items-center"
        >
            <div className=" relative w-[60px] h-[50px] lg:w-[50px] lg:h-[50px] rounded-full ">
                <Image
                    src="/assets/images/default-user-image.png"
                    layout="fill"
                    alt="profile-image"
                    className="rounded-full p-2 lg:p-0 cover-center-img"
                ></Image>
            </div>
            <p className="title1 text-black lg:text-[18px] lg:font-bold lg:leading-[32px] whitespace-nowrap">
                {t("noMessage")}
            </p>
        </section>
    );
};