"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut as LogOutIcon, User as UserIcon } from "@/components/ui/animated-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useUserProfile } from "@/components/providers/user-provider";
import { useUserSettings } from "@/components/providers/settings-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import { getInitials } from "@/lib/user-profile";
import { createClient } from "@/utils/supabase/client";
import {
  ProfileMenu,
  ProfileMenuContent,
  ProfileMenuGroup,
  ProfileMenuHeader,
  ProfileMenuItem,
} from "@/components/ui/profile-menu";

export function NavUser() {
  const user = useUserProfile();
  const { settings } = useUserSettings();
  const { t } = useI18n();
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [hoveredAction, setHoveredAction] = React.useState<"logout" | "account" | null>(null);
  const displayName = settings.account.name || settings.profile.username || user?.name;
  const displayEmail = settings.profile.email || user?.email;
  const avatarSrc =
    settings.profile.avatarUrl || user?.avatarUrl || "/images/avatars/01.png";
  const initials = getInitials(displayName, displayEmail);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{displayName}</div>
              <div className="text-muted-foreground truncate text-xs">{displayEmail}</div>
            </div>
            <Avatar className="rounded-full">
              <AvatarImage src={avatarSrc} alt={displayName ?? t("userMenu.avatarAlt")} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="relative w-full">
          <ProfileMenu
            open={open}
            onOpenChange={setOpen}
            className="bottom-0 left-0 top-auto z-50 flex-col-reverse rounded-lg"
            initial={{ width: "100%", height: "auto" }}
            animate={{ width: "100%", height: open ? "fit-content" : "auto" }}>
            <ProfileMenuHeader
              className="w-full rounded-md px-2 py-1.5"
              onClick={() => setOpen((prev) => !prev)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setOpen((prev) => !prev);
                }
              }}>
              <Avatar className="shrink-0 rounded-full">
                <AvatarImage src={avatarSrc} alt={displayName ?? t("userMenu.avatarAlt")} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{displayName}</div>
                <div className="text-muted-foreground truncate text-xs">{displayEmail}</div>
              </div>
            </ProfileMenuHeader>
            <ProfileMenuContent>
              <ProfileMenuGroup className="w-full">
                <ProfileMenuItem
                  onClick={handleLogout}
                  onMouseEnter={() => setHoveredAction("logout")}
                  onMouseLeave={() => setHoveredAction((current) => (current === "logout" ? null : current))}
                >
                  <LogOutIcon className="size-4" animate={hoveredAction === "logout" ? true : undefined} />
                  {t("userMenu.logout")}
                </ProfileMenuItem>
                <Separator className="my-0.5" />
                <ProfileMenuItem
                  onMouseEnter={() => setHoveredAction("account")}
                  onMouseLeave={() => setHoveredAction((current) => (current === "account" ? null : current))}
                  onClick={() => {
                    router.push("/settings/account");
                  }}>
                  <UserIcon className="size-4" animate={hoveredAction === "account" ? true : undefined} />
                  {t("userMenu.account")}
                </ProfileMenuItem>
              </ProfileMenuGroup>
            </ProfileMenuContent>
          </ProfileMenu>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
