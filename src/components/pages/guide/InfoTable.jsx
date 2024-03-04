export default function InfoTable({ array }) {
  return (
    <>
      <div className="flex items-center flex-col w-full">
        {array
          .filter((_i) => _i)
          .map((i, j) => (
            <div key={j} className="flex w-full mb-2 ">
              <div
                className={`min-w-[40px] h-[40px] rounded-lg border-[1px] border-gray5 ml-2 ltr:mr-2 flex items-center justify-center overflow-hidden`}
              >
                {i?.icon}
              </div>

              <div className=" w-full rounded-lg border-[1px] border-gray5 caption1 px-4 py-[9px]">
                {i.title}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
