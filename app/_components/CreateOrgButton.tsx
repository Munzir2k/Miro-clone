import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OrganizationProfile } from "@clerk/nextjs";
import { LucideIcon } from "lucide-react";

import React from "react";

interface CreateOrgButtonProps {
  name?: string;
  icon: LucideIcon;
  organizationTag?: React.ReactNode;
}
// Reusable Create Organization Button
const CreateOrgButton = ({
  name,
  icon: Icon,
  organizationTag,
}: CreateOrgButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button variant={"outline"} className="">
            <Icon className="mr-2" />
            {name}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent
        className={`p-0 bg-transparent border-none ${organizationTag === "<CreateOrganization />" ? "max-w-[430px]" : "max-w-[850px]"}  `}
      >
        {organizationTag}
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrgButton;
