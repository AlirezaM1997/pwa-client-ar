export default function StatisticsTable({ array, title, classNames = "" }) {
  return (
    <div className={classNames}>
      <h1 className="text-center heading text-black mb-[30px] lg:text-[24px]">{title}</h1>
      {array.map((i, j) => (
        <div
          className={`flex items-center justify-between leading-[26px] py-[10px] px-4 ${
            j !== array.length - 1 ? "border-b-[1px] border-gray6" : ""
          } ${j % 2 !== 0 && "bg-gray6"}`}
          key={j}
        >
          <span className="title1 text-gray3 lg:text-[16px]">{i.title}</span>
          <span className="heading text-black lg:text-[16px]">{i.count}</span>
        </div>
      ))}
    </div>
  );
}
