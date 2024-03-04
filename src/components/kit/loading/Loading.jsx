export default function Loading({ loadingHeight = "100%", loadingWidth = "w-full" }) {
  return (
    <>
      <div style={{ height: loadingHeight }} className={`${loadingWidth} z-[1003]`}>
        <div className="w-full h-full flex justify-center items-center">
          <div className="inline-block absolute z-[1004] w-[72px] h-[72px] after:content-[''] after:block after:w-14 after:h-14 after:m-2 after:rounded-full after:border-[#008BA8_transparent_#008BA8_transparent] after:border-[6px] after:animate-loading "></div>
        </div>
      </div>
    </>
  );
}
