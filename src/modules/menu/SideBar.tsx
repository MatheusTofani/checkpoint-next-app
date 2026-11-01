import { Suspense } from "react";
import Link from "next/link";
import { CircleCheckBigIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/src/components/ui/sidebar";
import { getCurrentUser } from "@/src/lib/dal";
import { SideBarNav, SideBarNavSkeleton } from "./SideBarNav";
import { SideBarUser, SideBarUserSkeleton } from "./SideBarUser";

export default function SideBar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <CircleCheckBigIcon className="size-4" />
              </div>
              <span className="truncate font-semibold">Checkpoint</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* usePathname pode suspender com cacheComponents */}
        <Suspense fallback={<SideBarNavSkeleton />}>
          <SideBarNav />
        </Suspense>
      </SidebarContent>

      <SidebarFooter>
        <Suspense fallback={<SideBarUserSkeleton />}>
          <CurrentUser />
        </Suspense>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

async function CurrentUser() {
  const user = await getCurrentUser();
  const profile = user.profiles.find((p) => p.id === user.profileId);

  return (
    <SideBarUser name={user.name} email={user.email} profileName={profile?.name} />
  );
}
