"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUserSettings } from "@/components/providers/settings-provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { gooey } from "@/components/ui/custom/gooey-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell as BellIcon, BookOpen, Target, Award } from "honestui/icons";
import { useI18n } from "@/components/providers/i18n-provider";

const notificationsFormSchema = z.object({
  learning_reminders: z.boolean().default(true),
  path_milestones: z.boolean().default(true),
  lab_milestones: z.boolean().default(true),
  email_enabled: z.boolean().default(true)
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export default function Page() {
  const { settings, saveSettings, isSaving } = useUserSettings();
  const { t } = useI18n();

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      learning_reminders: settings.notifications.learning_reminders,
      path_milestones: settings.notifications.path_milestones,
      lab_milestones: settings.notifications.lab_milestones,
      email_enabled: settings.notifications.email_enabled
    }
  });

  useEffect(() => {
    form.reset({
      learning_reminders: settings.notifications.learning_reminders,
      path_milestones: settings.notifications.path_milestones,
      lab_milestones: settings.notifications.lab_milestones,
      email_enabled: settings.notifications.email_enabled
    });
  }, [form, settings]);

  async function onSubmit(data: NotificationsFormValues) {
    try {
      await saveSettings({
        notifications: data
      });
      gooey.success({ 
        title: t("settings.notifications.toast.success"),
        description: "Your notification preferences have been updated." 
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t("settings.notifications.toast.error");
      gooey.error({ 
        title: "Failed to save settings",
        description: message || t("settings.notifications.toast.error") 
      });
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h3 className="text-lg font-semibold mb-1">
          {t("settings.notifications.title")}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          {t("settings.notifications.description")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="learning_reminders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start justify-between rounded-lg border p-5 hover:bg-muted/50 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <FormLabel className="text-base font-medium cursor-pointer">
                        {t("settings.notifications.learningReminders.label")}
                      </FormLabel>
                    </div>
                    <FormDescription className="text-xs">
                      {t("settings.notifications.learningReminders.description")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="path_milestones"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start justify-between rounded-lg border p-5 hover:bg-muted/50 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <FormLabel className="text-base font-medium cursor-pointer">
                        {t("settings.notifications.pathMilestones.label")}
                      </FormLabel>
                    </div>
                    <FormDescription className="text-xs">
                      {t("settings.notifications.pathMilestones.description")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lab_milestones"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start justify-between rounded-lg border p-5 hover:bg-muted/50 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <FormLabel className="text-base font-medium cursor-pointer">
                        {t("settings.notifications.labMilestones.label")}
                      </FormLabel>
                    </div>
                    <FormDescription className="text-xs">
                      {t("settings.notifications.labMilestones.description")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-6">{t("settings.notifications.delivery.title")}</h3>
            <FormField
              control={form.control}
              name="email_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start justify-between rounded-lg border p-5 hover:bg-muted/50 transition-colors">
                  <div className="space-y-1 flex-1">
                    <FormLabel className="text-base font-medium cursor-pointer">
                      {t("settings.notifications.email.label")}
                    </FormLabel>
                    <FormDescription className="text-xs">
                      {t("settings.notifications.email.description")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-end pt-2">
            <Button type="submit" disabled={isSaving} size="lg">
              {isSaving ? t("settings.notifications.savingButton") : t("settings.notifications.saveButton")}
            </Button>
          </div>
        </form>
      </Form>

      <Card className="bg-muted/30 border-muted">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BellIcon className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">{t("settings.notifications.about.title")}</h4>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("settings.notifications.about.description")}
            </p>
            <ul className="text-muted-foreground space-y-1.5 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                <span>{t("settings.notifications.about.list1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                <span>{t("settings.notifications.about.list2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                <span>{t("settings.notifications.about.list3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                <span>{t("settings.notifications.about.list4")}</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
