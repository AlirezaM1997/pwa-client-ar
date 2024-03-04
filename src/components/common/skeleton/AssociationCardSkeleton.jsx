import Skeleton from "@components/kit/skeleton/Main";

export default function AssociationCardSkeleton() {
  return (
    <div className="flex flex-row mr-[16px] py-[26px] w-full border-b-[1px] items-center">
      <Skeleton height={66} width={66} circle></Skeleton>
      <div className="flex flex-col mx-3">
        <div className="flex flex-row items-center gap-1">
          <Skeleton height={18} width={80} />
        </div>
      </div>
    </div>
  );
}
