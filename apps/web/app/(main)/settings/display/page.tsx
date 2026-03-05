"use client";

import { useEffect, useSyncExternalStore } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SIDEBAR_ITEMS } from "@/lib/settings";
import { useUserSettings } from "@/components/providers/settings-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { gooey } from "@/components/ui/custom/gooey-toast";
import { useI18n } from "@/components/providers/i18n-provider";

const displayFormSchema = z.object({
  sidebarItems: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item."
    }),
  showProfile: z.boolean()
});

type DisplayFormValues = z.infer<typeof displayFormSchema>;

export default function Page() {
  const { settings, saveSettings, isSaving } = useUserSettings();
  const { t } = useI18n();
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues: {
      sidebarItems: settings.display.sidebarItems,
      showProfile: settings.display.showProfile
    }
  });

  useEffect(() => {
    form.reset({
      sidebarItems: settings.display.sidebarItems,
      showProfile: settings.display.showProfile
    });
  }, [form, settings]);

  async function onSubmit(data: DisplayFormValues) {
    try {
      await saveSettings({
        display: {
          sidebarItems: data.sidebarItems,
          showProfile: data.showProfile
        }
      });
      gooey.success({ 
        title: t("display.toast.success"),
        description: "Your display preferences have been updated." 
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t("display.toast.error");
      gooey.error({ 
        title: "Failed to save settings",
        description: message || t("display.toast.error") 
      });
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-1">{t("display.sidebar.label")}</h3>
            <p className="text-sm text-muted-foreground mb-6">{t("display.sidebar.description")}</p>
            <FormField
              control={form.control}
              name="sidebarItems"
              render={() => (
                <FormItem>
                  <div className="space-y-3">
                    {SIDEBAR_ITEMS.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="sidebarItems"
                        render={({ field }) => {
                          return (
                            <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== item.id)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer flex-1">{t(item.labelKey)}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage className="mt-4" />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div>
            <FormField
              control={form.control}
              name="showProfile"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-5 hover:bg-muted/50 transition-colors">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none flex-1">
                    <FormLabel className="text-base font-medium cursor-pointer">
                      {t("display.profile.label")}
                    </FormLabel>
                    <FormDescription className="text-xs">
                      {t("display.profile.description")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-end pt-2">
            <Button type="submit" disabled={isSaving} size="lg">
              {isSaving ? t("display.savingButton") : t("display.updateButton")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
