import Skeleton from "@components/kit/skeleton/Main";

export default function StatisticsTableSkeleton({ classNames = "" }) {
  const array = [1, 2];
  return (
    <div className={classNames}>
      <Skeleton height={30} className="mb-1" />
      {array.map((i) => (
        <>
          <Skeleton key={i} height={43} className="mb-1" />
        </>
      ))}
    </div>
  );
}
