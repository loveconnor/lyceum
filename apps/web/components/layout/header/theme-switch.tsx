"use client";

import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { MoonIcon } from "@/components/ui/icons/moon";
import { SunIcon } from "@/components/ui/icons/sun";
import { useUserSettings } from "@/components/providers/settings-provider";
import { useCircularTransition } from "@/hooks/use-circular-transition";

import { Button } from "@/components/ui/button";
import "./circular-transition.css";

export default function ThemeSwitch() {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
  const { theme, setTheme } = useTheme();
  const { settings, saveSettings } = useUserSettings();
  const { startTransition } = useCircularTransition();
  const [isHovered, setIsHovered] = useState(false);

  if (!mounted) {
    return null;
  }

  const persistThemeChange = async (newTheme: "light" | "dark") => {
    try {
      await saveSettings({
        appearance: {
          ...settings.appearance,
          theme: newTheme,
        },
      });
    } catch (error) {
      console.error("Failed to persist theme change:", error);
    }
  };

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === "light" ? "dark" : "light";
    startTransition({ x: event.clientX, y: event.clientY }, () => {
      setTheme(newTheme);
    });
    void persistThemeChange(newTheme);
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className="mode-toggle-button relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={toggleTheme}>
      {theme === "light" ? <SunIcon animate={isHovered ? true : undefined} /> : <MoonIcon animate={isHovered ? true : undefined} />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
