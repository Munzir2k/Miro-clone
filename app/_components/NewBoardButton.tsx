"use client";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { title } from "process";
import { toast } from "sonner";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}
function NewBoardButton({ orgId, disabled }: NewBoardButtonProps) {
  // router
  const router = useRouter();
  const { mutate, pending } = useApiMutation(api.board.create);
  const createBoard = () => {
    mutate({
      orgId,
      title: "New Board",
    })
      .then((id) => {
        toast.success(`Board created`, {
          classNames: {
            icon: "text-green-500",
          },
        });
        router.push(`/board/${id}`);
      })
      .catch(() => {
        toast.error("Failed to create board", {
          classNames: {
            icon: "text-red-500",
          },
        });
      });
  };
  return (
    <button
      disabled={pending || disabled}
      onClick={createBoard}
      className={cn(
        "col-span-1 aspect-[100/127] bg-blue-600 hover:bg-blue-800 rounded-lg flex flex-col items-center justify-center py-6",
        (pending || disabled) &&
          "opacity-75 hover:bg-blue-600 cursor-not-allowed"
      )}
    >
      <div />
      <Plus className="h-12 w-12 stroke-1" />
      <p className="text-sm font-light">New Board</p>
    </button>
  );
}

export default NewBoardButton;
