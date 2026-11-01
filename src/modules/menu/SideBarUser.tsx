"use client";

import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react";
import { logout } from "@/src/app/actions/auth";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/src/components/ui/sidebar";
import { Skeleton } from "@/src/components/ui/skeleton";
import { getInitials } from "@/src/lib/format";

export interface SideBarUserProps {
  name: string;
  email: string;
  profileName?: string;
}

export function SideBarUser({ name, email, profileName }: SideBarUserProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="rounded-lg after:rounded-lg">
              <AvatarFallback className="rounded-lg">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-xs text-sidebar-foreground/70">
                {profileName ?? email}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="grid text-sm leading-tight">
                  <span className="truncate font-medium text-foreground">
                    {name}
                  </span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => logout()}>
              <LogOutIcon />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function SideBarUserSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex h-12 items-center gap-2 p-2">
        <Skeleton className="size-8 rounded-lg bg-sidebar-accent" />
        <div className="grid flex-1 gap-1">
          <Skeleton className="h-3.5 w-3/4 bg-sidebar-accent" />
          <Skeleton className="h-3 w-1/2 bg-sidebar-accent" />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
