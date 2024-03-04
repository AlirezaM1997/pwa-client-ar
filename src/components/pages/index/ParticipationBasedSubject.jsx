import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { MoreSquare } from "iconsax-react";
import { useWindowSize } from "@uidotdev/usehooks";
import Image from "next/image";
// COMPONENT DYNAMIC IMPORT
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const HorizontalCarousel = dynamic(() => import("@components/common/HorizontalCarousel"), {
  ssr: false,
});

export default function ParticipationBasedSubject({ tHome, lang, t, data }) {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const size = useWindowSize();

  const ListOfSubject = () => {
    return data
      .slice(0, 9)
      .map((i, _j) => (
        <div
          key={_j}
          className="flex flex-col items-center "
          onClick={() =>
            router.push(
              {
                pathname: "search",
                query: { subjects: i?._id },
              },
              undefined,
              { shallow: true }
            )
          }
        >
          <div className="lg:p-4 p-2 w-16 h-16 lg:w-[100px] lg:h-[100px] bg-[#F0F8FA] rounded-full flex items-center justify-center cursor-pointer">
            <div className="flex items-center justify-center relative p-2">
              {i.icon === "" ? (
                <div className="unset-img">
                  <Image
                    alt="subject"
                    src={`/assets/images/subjects-icon/png-Default.png`}
                    layout="fill"
                    className="custom-img"
                  />
                </div>
              ) : (
                <div className="unset-img">
                  <Image
                    alt="subject"
                    src={`/assets/images/subjects-icon/${i.icon}.png`}
                    layout="fill"
                    className="custom-img"
                  />
                </div>
              )}
            </div>
          </div>
          <p className="caption3 pt-2 text-center">{i.name}</p>
        </div>
      ))
      .concat(
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => (size.width < 960 ? setOpen(true) : setOpenModal(true))}
        >
          <div className="p-2 w-16 h-16 lg:w-[100px] lg:h-[100px] bg-[#F0F8FA] rounded-full flex items-center justify-center">
            <MoreSquare color="#484848" size={size.width < 960 ? 22 : 36} />
          </div>
          <p className="caption3 pt-2">{t("more")}</p>
        </div>
      );
  };

  return (
    <>
      <section>
        {size.width < 1280 ? (
          <HorizontalCarousel
            lang={lang}
            t={t}
            title={lang == "ar" ? tHome("categoriesTopics") : tHome("participateBasedSubject")}
            hasShowMore={false}
            spaceBetween={25}
            slidesOffsetBefore="18"
            array={ListOfSubject()}
          />
        ) : (
          <div className="px-[30px]">
            <div className="flex items-center justify-between mb-4 lg:mb-[30px]">
              <h1 className="titleInput lg:title4 text-black">
                {tHome("participateBasedSubject")}
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <ListOfSubject />
            </div>
          </div>
        )}
      </section>
      <BottomSheet open={open} setOpen={setOpen}>
        <div className="px-4 pb-[30px]">
          <h1 className="title1">{tHome("chooseBasedSubject")}</h1>
          <div className="grid grid-cols-4 gap-x-[21px] gap-y-6 pt-8">
            {data.map((item, _index) => (
              <div
                key={_index}
                className="flex flex-col items-center "
                onClick={() =>
                  router.push(
                    {
                      pathname: "search",
                      query: { subjects: item?._id },
                    },
                    undefined,
                    { shallow: true }
                  )
                }
              >
                <div className="p-2 w-16 h-16 bg-[#F0F8FA] rounded-full flex items-center justify-center">
                  <div className="flex items-center justify-center relative p-2">
                    {item.icon === "" ? (
                      <div className="unset-img">
                        <Image
                          alt="subject"
                          src={`/assets/images/subjects-icon/png-Default.png`}
                          layout="fill"
                          className="custom-img"
                        />
                      </div>
                    ) : (
                      <div className="unset-img">
                        <Image
                          alt="subject"
                          src={`/assets/images/subjects-icon/${item.icon}.png`}
                          layout="fill"
                          className="custom-img"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <p className="caption3 pt-2 text-center">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>
      {openModal && (
        <div
          className={` fixed w-full h-screen z-[10000] bg-[#31313133] backdrop-blur-[2px] top-0 right-0 `}
          onClick={() => setOpenModal(false)}
        >
          <section
            className="absolute bg-white h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[10px] lg:w-[980px] lg:py-[30px] lg:px-[25px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="title1 border-b-[1px] border-gray5 pb-[20px]">
              {tHome("chooseBasedSubject")}
            </h1>
            <div className="grid grid-cols-4 lg:grid-cols-6 gap-x-[21px] lg:gap-x-[60px] lg:gap-y-[70px] gap-y-6 pt-8">
              {data.map((item, _index) => (
                <div
                  key={_index}
                  className="flex flex-col items-center "
                  onClick={() =>
                    router.push(
                      {
                        pathname: "search",
                        query: { subjects: item?._id },
                      },
                      undefined,
                      { shallow: true }
                    )
                  }
                >
                  <div className="p-2 lg:p-4 w-16 h-16 lg:w-[100px] lg:h-[100px] bg-[#F0F8FA] rounded-full flex items-center justify-center">
                    <div className="flex items-center justify-center relative p-2">
                      {item.icon === "" ? (
                        <div className="unset-img">
                          <Image
                            alt="subject"
                            src={`/assets/images/subjects-icon/png-Default.png`}
                            layout="fill"
                            className="custom-img"
                          />
                        </div>
                      ) : (
                        <div className="unset-img">
                          <Image
                            alt="subject"
                            src={`/assets/images/subjects-icon/${item.icon}.png`}
                            layout="fill"
                            className="custom-img"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="caption3 pt-2 text-center">{item.name}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
