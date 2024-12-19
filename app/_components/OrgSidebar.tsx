"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { LayoutDashboard, Star } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const OrgSidebar = () => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");
  return (
    <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
      <Link href={"/"}>
        <div className="flex items-center  gap-x-2">
          <Image src={"/logo.svg"} width={60} height={60} alt={"logo"} />
          <span className={cn("font-semibold text-2xl", font.className)}>
            Board
          </span>
        </div>
      </Link>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: "6px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              justifyContent: "space-between",
              backgroundColor: "white",
              color: "black",

              "&:hover": {
                backgroundColor: "white",
              },
              "&:focus": {
                backgroundColor: "white",
              },
            },
          },
        }}
      />
      <div className="space-y-1 w-full">
        <Button
          asChild
          variant={favorites ? "ghost" : "secondary"}
          size={"lg"}
          className={`font-normal justify-start px-2 w-full dark:bg-transparent ${favorites ? "bg-white hover:bg-white" : "bg-gray-300 hover:bg-gray-300 dark:bg-gray-800"}`}
        >
          <Link href={"/"}>
            <LayoutDashboard className="w-5 h-5 mr-2" />
            Team Board
          </Link>
        </Button>
        <Button
          asChild
          variant={favorites ? "secondary" : "ghost"}
          size={"lg"}
          className={`font-normal justify-start px-2 w-full dark:bg-transparent ${favorites ? "bg-gray-300 hover:bg-gray-300 dark:bg-gray-800" : "bg-white hover:bg-white"}`}
        >
          <Link
            href={{
              pathname: "/",
              query: { favorites: true },
            }}
          >
            <Star className="w-5 h-5 mr-2" />
            Favorite Board
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OrgSidebar;
