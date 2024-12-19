"use client";

import { Hint } from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ToolButtonProps {
  lable: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisable?: boolean;
}

export const ToolButton = ({
  lable,
  icon: Icon,
  onClick,
  isActive,
  isDisable,
}: ToolButtonProps) => {
  return (
    <Hint label={lable} side="right" sideOffset={14}>
      <Button
        disabled={isDisable}
        className="mt-[5px] mb-[5px]"
        onClick={onClick}
        size={"icon"}
        variant={isActive ? "boardActive" : "board"}
      >
        <Icon />
      </Button>
    </Hint>
  );
};
