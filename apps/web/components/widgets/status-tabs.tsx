"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatusTabsProps<T extends string> {
  onTabChange: (tab: T | "all") => void;
  activeTab: T | "all";
  statusEnum: Record<string, T>;
  statusNamed: Record<T, string>;
  allLabel: string;
  resultsId?: string;
}

function StatusTabs<T extends string>({
  onTabChange,
  activeTab,
  statusEnum,
  statusNamed,
  allLabel,
  resultsId
}: StatusTabsProps<T>) {
  return (
    <Tabs
      onValueChange={(value) => onTabChange(value as T | "all")}
      value={activeTab}>
      <TabsList>
        {(["all" as const, ...Object.values(statusEnum)]).map((status) => (
          <TabsTrigger
            key={status}
            value={status}
            {...(resultsId && { id: `${resultsId}-tab-${status}`, "aria-controls": resultsId })}>
            {status === "all" ? allLabel : statusNamed[status]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export default StatusTabs;
