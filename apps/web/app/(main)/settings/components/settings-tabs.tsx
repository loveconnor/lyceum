"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/components/providers/i18n-provider";
import type { MessageKey } from "@/lib/i18n";
import {
  User as UserIcon,
  Heart as HeartIcon,
  Paintbrush as PaintbrushIcon,
  Bell as BellIcon,
} from "@/components/ui/animated-icons";

const settingsTabs: Array<{
  titleKey: MessageKey;
  href: string;
  value: string;
}> = [
  {
    titleKey: "settings.nav.account",
    href: "/settings/account",
    value: "account"
  },
  {
    titleKey: "settings.nav.interests",
    href: "/settings/interests",
    value: "interests"
  },
  {
    titleKey: "settings.nav.appearance",
    href: "/settings/appearance",
    value: "appearance"
  },
  {
    titleKey: "settings.nav.notifications",
    href: "/settings/notifications",
    value: "notifications"
  },
  {
    titleKey: "settings.nav.display",
    href: "/settings/display",
    value: "display"
  }
];

export function SettingsTabs({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [hoveredTabValue, setHoveredTabValue] = React.useState<string | null>(null);

  const currentTab = settingsTabs.find((tab) => pathname === tab.href)?.value || "account";
  const renderTabIcon = (tabValue: string) => {
    const shouldAnimate = hoveredTabValue === tabValue;

    if (tabValue === "account") {
      return <UserIcon className="h-4 w-4" animate={shouldAnimate ? true : undefined} />;
    }
    if (tabValue === "interests") {
      return <HeartIcon className="h-4 w-4" animate={shouldAnimate ? true : undefined} />;
    }
    if (tabValue === "appearance") {
      return <PaintbrushIcon className="h-4 w-4" animate={shouldAnimate ? true : undefined} />;
    }
    if (tabValue === "notifications") {
      return <BellIcon className="h-4 w-4" animate={shouldAnimate ? true : undefined} />;
    }
    return <PaintbrushIcon className="h-4 w-4" animate={shouldAnimate ? true : undefined} />;
  };

  return (
    <Tabs value={currentTab} onValueChange={(value) => {
      const tab = settingsTabs.find((t) => t.value === value);
      if (tab) {
        router.push(tab.href);
      }
    }}>
      <TabsList className="mb-8 grid w-full max-w-3xl mx-auto grid-cols-5 h-12">
        {settingsTabs.map((tab) => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value} 
            className="flex items-center gap-2 data-[state=active]:bg-background text-sm"
            onMouseEnter={() => setHoveredTabValue(tab.value)}
            onMouseLeave={() => setHoveredTabValue((current) => (current === tab.value ? null : current))}
          >
            {renderTabIcon(tab.value)}
            <span className="hidden sm:inline">{t(tab.titleKey)}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="mt-6">
        {children}
      </div>
    </Tabs>
  );
}
