import { useWindowSize } from "@uidotdev/usehooks";
// COMPONENT
import Skeleton from "@components/kit/skeleton/Main";

function ProjectStatusSkeleton() {
  const size = useWindowSize();
  return (
    <div className="flex flex-col lg:flex-row w-full justify-between">
      <div className="flex flex-col w-full">
        <Skeleton width="100%" height="50%" className="mb-1" />
        <Skeleton width="100%" className="mb-1" height={60} />
        <div className="flex items-center gap-x-[10px]">
          <Skeleton height={size.width < 960 ? 40 : 48} width={size.width < 960 ? "" : 152} />
          <Skeleton height={size.width < 960 ? 40 : 48} width={size.width < 960 ? "" : 152} />
        </div>
      </div>
    </div>
  );
}

export default ProjectStatusSkeleton;
