"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "@/convex/_generated/api";
import ConfirmModel from "./ConfirmModel";
import { Button } from "./ui/button";
import { useRenameModel } from "@/store/useRenameModel";

interface ActionProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

const Actions = ({ children, id, title, side, sideOffset }: ActionProps) => {
  const { onOpen } = useRenameModel();
  const { mutate, pending } = useApiMutation(api.board.remove);

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => {
        toast.success(`Link copied to clipboard`, {
          classNames: {
            icon: "text-green-500",
          },
        });
      })
      .catch(() => {
        toast.error(`Failed to copy link`, {
          classNames: {
            icon: "text-red-500",
          },
        });
      });
  };

  const onDelete = () => {
    mutate({ id })
      .then(() => {
        toast.success(`Board deleted`, {
          classNames: {
            icon: "text-green-500",
          },
        });
      })
      .catch(() => {
        toast.error(`Failed to delete board`, {
          classNames: {
            icon: "text-red-500",
          },
        });
      });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        sideOffset={sideOffset}
        className="w-60"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem onClick={onCopyLink} className="p-3 cursor-pointer">
          <Link2 className="h-4 w-4 mr-2" />
          Copy Board Link
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onOpen(id, title)}
          className="p-3 cursor-pointer"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <ConfirmModel
          header="Delete Board?"
          description="Are you sure you want to delete this board?"
          disabled={pending}
          onConfirm={onDelete}
        >
          <Button variant={"ghost"} className="rounded-sm px-[7.2rem]">
            <Trash2 className="h-4 w-4 mr-2 -ml-[8.5rem]" />
            Delete
          </Button>
        </ConfirmModel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
