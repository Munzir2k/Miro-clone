"use client";

import {
  OrganizationProfile,
  OrganizationSwitcher,
  useOrganization,
  UserButton,
} from "@clerk/nextjs";
import SearchInput from "./SearchInput";
import { ThemeToggleMode } from "@/components/ThemeToggleMode";
import CreateOrgButton from "./CreateOrgButton";
import { Send } from "lucide-react";

function Navbar() {
  const { organization } = useOrganization();

  return (
    <div className="flex items-center gap-x-4 p-5">
      <div className="hidden lg:flex lg:flex-1">
        <SearchInput />
      </div>
      <div className="block lg:hidden flex-1">
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                maxWidth: "370px",
              },
              organizationSwitcherTrigger: {
                padding: "6px",
                width: "100%",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                justifyContent: "space-between",
              },
            },
          }}
        />
      </div>
      {organization && (
        <CreateOrgButton
          icon={Send}
          organizationTag={<OrganizationProfile routing="hash" />}
          name={"Invite Member"}
        />
      )}
      <ThemeToggleMode />
      <UserButton />
    </div>
  );
}

export default Navbar;
