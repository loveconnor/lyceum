import * as React from "react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useUserProfile } from "@/components/providers/user-provider";
import { getInitials } from "@/lib/user-profile";
import { createClient } from "@/utils/supabase/client";
import { useUserSettings } from "@/components/providers/settings-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  ProfileMenu,
  ProfileMenuContent,
  ProfileMenuGroup,
  ProfileMenuHeader,
  ProfileMenuHeaderContent,
  ProfileMenuItem,
  ProfileMenuTrigger,
} from "@/components/ui/profile-menu";
import { LogOutIcon } from "@/components/ui/icons/log-out";
import { UserIcon } from "@/components/ui/icons/user";

export default function UserMenu() {
  const user = useUserProfile();
  const { settings } = useUserSettings();
  const { t } = useI18n();
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = React.useState(false);
  const displayName = settings.account.name || settings.profile.username || user?.name;
  const displayEmail = settings.profile.email || user?.email;
  const avatarSrc = settings.profile.avatarUrl || user?.avatarUrl || "/images/avatars/01.png";
  const initials = getInitials(displayName, displayEmail);
  const [open, setOpen] = React.useState(false);
  const [hoveredAction, setHoveredAction] = React.useState<"logout" | "account" | null>(null);
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
      <Avatar>
        <AvatarImage src={avatarSrc} alt={displayName ?? t("userMenu.avatarAlt")} />
        <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className="relative h-10 w-10 shrink-0">
      <ProfileMenu open={open} onOpenChange={setOpen} className="z-50">
        <ProfileMenuHeader>
          <ProfileMenuHeaderContent className="flex max-w-56 flex-col">
            <div className="truncate text-sm font-semibold">{displayName}</div>
            <div className="text-muted-foreground truncate text-xs">{displayEmail}</div>
          </ProfileMenuHeaderContent>
          <ProfileMenuTrigger>
            <div className="flex items-center justify-end">
              <Avatar>
                <AvatarImage src={avatarSrc} alt={displayName ?? t("userMenu.avatarAlt")} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
            </div>
          </ProfileMenuTrigger>
        </ProfileMenuHeader>
        <ProfileMenuContent>
          <ProfileMenuGroup className="w-56">
            <ProfileMenuItem
              onMouseEnter={() => setHoveredAction("account")}
              onMouseLeave={() => setHoveredAction((current) => (current === "account" ? null : current))}
              onClick={() => {
                router.push("/settings/account");
              }}>
              <UserIcon className="size-4" animate={hoveredAction === "account" ? true : undefined} />
              {t("userMenu.account")}
            </ProfileMenuItem>
            <Separator className="my-0.5" />
            <ProfileMenuItem
              onClick={handleLogout}
              onMouseEnter={() => setHoveredAction("logout")}
              onMouseLeave={() => setHoveredAction((current) => (current === "logout" ? null : current))}
            >
              <LogOutIcon className="size-4" animate={hoveredAction === "logout" ? true : undefined} />
              {t("userMenu.logout")}
            </ProfileMenuItem>
          </ProfileMenuGroup>
        </ProfileMenuContent>
      </ProfileMenu>
    </div>
  );
}
