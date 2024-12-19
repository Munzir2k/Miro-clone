"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useOrganization } from "@clerk/nextjs";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const EmptyBoards = () => {
  // router
  const router = useRouter();
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.board.create);

  const CreateBoard = () => {
    if (!organization) return;
    mutate({
      orgId: organization?.id,
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
      .catch(() =>
        toast.error("Failed to create board", {
          classNames: {
            icon: "text-red-500",
          },
        })
      );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-y-3">
      <Image src={"/notes.svg"} width={500} height={500} alt={"empty"} />
      <h2 className="text-2xl font-semibold mt-6">Create your first board</h2>

      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a new board for your organization
      </p>
      <Button disabled={pending} onClick={CreateBoard}>
        Create Board
      </Button>
    </div>
  );
};

export default EmptyBoards;
