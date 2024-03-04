export default function StatusBadge({ tW, status }) {
  return (
    <>
      {status === "DONE" ? (
        <div className="rounded-[22px] bg-[#23A26D1F] text-success px-[10px] py-[6px] title2">
          {tW("success")}
        </div>
      ) : status === "FAIL" ? (
        <div className="rounded-[22px] bg-[#CB3A311F] text-danger px-[10px] py-[6px] title2">
          {tW("failed")}
        </div>
      ) : (
        <div className="rounded-[22px] bg-[#FF88001F] text-warning px-[10px] py-[6px] title2">
          {tW("pending")}
        </div>
      )}
    </>
  );
}
