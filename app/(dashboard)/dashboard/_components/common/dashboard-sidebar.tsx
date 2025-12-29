"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Home,
  Landmark,
  Layers2Icon,
  LucideIcon,
  ShieldCheck,
} from "lucide-react";

import { SidebarNav } from "./sidebar-nav";
import Logo from "@/components/common/logo";
import UserAvailableCreditsBadge from "@/components/common/user-available-credits-badge";

export type Route = {
  href: string;
  label: string;
  icon: LucideIcon;
};
const routes: Route[] = [
  { href: "/dashboard/home", label: "Home", icon: Home },
  {
    href: "/dashboard/workflows",
    label: "Workflows",
    icon: Layers2Icon,
  },
  { href: "/dashboard/credentials", label: "Credentials", icon: ShieldCheck },
  { href: "/dashboard/billing", label: "Billing", icon: Landmark },
];

export default function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarNav routes={routes} />
      </SidebarContent>
      <SidebarFooter>
        <UserAvailableCreditsBadge />
      </SidebarFooter>
    </Sidebar>
  );
}
