export default function ErrorBox({ kind, text, classNames }) {
  return (
    <div className={`${kind ? "" : "hidden"} flex items-center ${classNames}`}>
      <p className={`caption4 text-danger mr-[5px] ltr:ml-[5px]`}>{text}</p>
    </div>
  );
}
