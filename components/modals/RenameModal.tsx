"use client";

import { useRenameModel } from "@/store/useRenameModel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const RenameModal = () => {
  const { mutate, pending } = useApiMutation(api.board.update);

  const { isOpen, onClose, initialValues } = useRenameModel();
  const [title, setTitle] = useState(initialValues.title);

  useEffect(() => {
    setTitle(initialValues.title);
  }, [initialValues.title]);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    mutate({ id: initialValues.id, title })
      .then(() => {
        toast.success("Board renamed", {
          classNames: {
            icon: "text-green-500",
          },
        });
        onClose();
      })
      .catch(() => {
        toast.error("Failed to rename board", {
          classNames: {
            icon: "text-red-500",
          },
        });
      });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Board Title</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enter the new title for your board
        </DialogDescription>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            disabled={pending}
            required
            maxLength={60}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Board Title"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant={"outline"}
                className="hover:bg-red-600"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={pending}
              type="submit"
              className="bg-green-400 hover:bg-green-600"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameModal;
