"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  User as UserIcon,
  Heart as HeartIcon,
  Paintbrush as PaintbrushIcon,
  Bell as BellIcon,
} from "@/components/ui/animated-icons";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/components/providers/i18n-provider";
import type { MessageKey } from "@/lib/i18n";

const sidebarNavItems: Array<{
  titleKey: MessageKey;
  href: string;
}> = [
  {
    titleKey: "settings.nav.account",
    href: "/settings/account",
  },
  /*{
    title: "Billing",
    href: "/settings/billing",
    icon: CreditCardIcon
  }*/
  {
    titleKey: "settings.nav.interests",
    href: "/settings/interests",
  },
  {
    titleKey: "settings.nav.appearance",
    href: "/settings/appearance",
  },
  {
    titleKey: "settings.nav.notifications",
    href: "/settings/notifications",
  },
  {
    titleKey: "settings.nav.display",
    href: "/settings/display",
  }
];

export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [hoveredHref, setHoveredHref] = React.useState<string | null>(null);
  const renderSidebarIcon = (href: string) => {
    const shouldAnimate = hoveredHref === href;

    if (href === "/settings/account") {
      return <UserIcon animate={shouldAnimate ? true : undefined} />;
    }
    if (href === "/settings/interests") {
      return <HeartIcon animate={shouldAnimate ? true : undefined} />;
    }
    if (href === "/settings/appearance") {
      return <PaintbrushIcon animate={shouldAnimate ? true : undefined} />;
    }
    if (href === "/settings/notifications") {
      return <BellIcon animate={shouldAnimate ? true : undefined} />;
    }
    return <PaintbrushIcon animate={shouldAnimate ? true : undefined} />;
  };

  return (
    <Card className="py-0">
      <CardContent className="p-2">
        <nav className="flex flex-col space-y-0.5 space-x-2 lg:space-x-0">
          {sidebarNavItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "hover:bg-muted justify-start",
                pathname === item.href ? "bg-muted hover:bg-muted" : ""
              )}
              onMouseEnter={() => setHoveredHref(item.href)}
              onMouseLeave={() => setHoveredHref((current) => (current === item.href ? null : current))}
              asChild>
              <Link href={item.href}>
                {renderSidebarIcon(item.href)}
                {t(item.titleKey)}
              </Link>
            </Button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
