export default function ShowTags({ tags = [], classNames }) {
  return (
    <div className={`flex flex-wrap justify-start gap-2 w-full ${classNames}`}>
      {tags.map((tag, index) => {
        return (
          <div
            key={tag + index}
            className="flex justify-center items-center px-6 py-3 shrink-0 bg-gray8 rounded-lg"
          >
            <span className="text-black titleInput leading-4 h-4">{tag}</span>
          </div>
        );
      })}
    </div>
  );
}
