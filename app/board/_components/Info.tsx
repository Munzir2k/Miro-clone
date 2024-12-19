"use client";

import Actions from "@/components/Actions";
import { Hint } from "@/components/Hint";
import { ThemeToggleMode } from "@/components/ThemeToggleMode";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useRenameModel } from "@/store/useRenameModel";
import { useQuery } from "convex/react";
import { Menu } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5">|</div>;
};

export const Info = ({ boardId }: InfoProps) => {
  const { onOpen } = useRenameModel();
  const router = useRouter();
  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });

  if (!data) return <InfoSkeleton />;

  return (
    <div className="absolute top-2 left-2 bg-white dark:bg-slate-700 dark:text-gray-200 rounded-md px-1.5 h-12 flex items-center shadow-md">
      <Hint
        label="Go to Board page"
        align="start"
        sideOffset={12}
        side="bottom"
      >
        <Button
          variant={"board"}
          className="px-2"
          onClick={() => router.push(`/`)}
        >
          <Image src={"/logo.svg"} width={50} height={50} alt={"logo"} />
          <span className={cn("font-semibold text-xl ml-2 ", font.className)}>
            Board
          </span>
        </Button>
      </Hint>
      <TabSeparator />
      <Hint label="Rename Title" side="bottom" align="start" sideOffset={12}>
        <Button variant={"board"} onClick={() => onOpen(data._id, data.title)}>
          {data.title}
        </Button>
      </Hint>
      <TabSeparator />
      <Actions id={data._id} title={data.title} side="bottom" sideOffset={12}>
        <div>
          <Hint label="Main Menu" side="bottom" align="start" sideOffset={12}>
            <Button size={"icon"} variant={"board"} className="">
              <Menu />
            </Button>
          </Hint>
        </div>
      </Actions>
      <TabSeparator />
      <Hint label="Toggle Theme" side="bottom" align="start" sideOffset={12}>
        <div>
          <ThemeToggleMode />
        </div>
      </Hint>
    </div>
  );
};

export const InfoSkeleton = () => {
  return (
    <div className="absolute top-2 left-2 bg-white dark:bg-slate-700 rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px] animate-pulse duration-1000" />
  );
};
