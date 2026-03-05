import { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import { getServerTranslator } from "@/lib/i18n-server";

import { SettingsTabs } from "./components/settings-tabs";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Lyceum - Settings",
    description: "Manage your account settings and set e-mail preferences.",
    canonical: "/settings"
  });
}

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const t = await getServerTranslator();
  return (
    <div className="mx-auto max-w-6xl space-y-8 py-6 px-4 sm:px-6 lg:px-8">
      <div className="space-y-2 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-muted-foreground text-base">{t("settings.subtitle")}</p>
      </div>
      <SettingsTabs>{children}</SettingsTabs>
    </div>
  );
}
