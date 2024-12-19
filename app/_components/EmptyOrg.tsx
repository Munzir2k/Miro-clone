"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import React from "react";
import CreateOrgButton from "./CreateOrgButton";
import {
  CreateOrganization,
  useOrganization,
  useOrganizationList,
} from "@clerk/nextjs";

function EmptyOrg() {
  const { organization } = useOrganization();

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src={"/element.svg"} width={500} height={500} alt="empty" />
      <h2 className="text-2xl font-semibold mt-6">Welcome to Board</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Create an organization to get started
      </p>
      <div className="mt-6">
        {}
        <CreateOrgButton
          name="Create Organization"
          organizationTag={<CreateOrganization routing="hash" />}
          icon={Plus}
        />
      </div>
    </div>
  );
}

export default EmptyOrg;
