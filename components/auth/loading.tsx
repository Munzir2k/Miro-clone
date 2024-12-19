import Image from "next/image";

function Loading() {
  return (
    <div
      className="h-full w-full flex flex-col gap-y-4
  justify-center items-center bg-gray-900"
    >
      <Image
        src={"/logo.svg"}
        width={120}
        height={120}
        alt={"logo"}
        className="animate-pulse duration-700"
      />
    </div>
  );
}

export default Loading;
