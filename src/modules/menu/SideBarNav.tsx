"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/src/components/ui/sidebar";
import { Skeleton } from "@/src/components/ui/skeleton";
import { menuGroups } from "./menuItems";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SideBarNav() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return menuGroups.map((group) => (
    <SidebarGroup key={group.label}>
      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={isActive(pathname, item.href)}
                tooltip={item.title}
                render={
                  <Link
                    href={item.href}
                    // No mobile o sidebar é um Sheet; fecha ao navegar
                    onClick={() => isMobile && setOpenMobile(false)}
                  />
                }
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}

// SidebarMenuSkeleton usa Math.random(), o que quebra o prerender no fallback
export function SideBarNavSkeleton() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {["70%", "55%", "80%", "60%", "75%"].map((width, index) => (
          <SidebarMenuItem key={index} className="flex h-8 items-center gap-2 px-2">
            <Skeleton className="size-4 rounded-md" />
            <Skeleton className="h-4 flex-1" style={{ maxWidth: width }} />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
