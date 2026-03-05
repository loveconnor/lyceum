"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { gooey } from "@/components/ui/custom/gooey-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserSettings } from "@/components/providers/settings-provider";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useI18n } from "@/components/providers/i18n-provider";
import { SUPPORTED_LOCALES, getLanguageLabel } from "@/lib/i18n";
import { UserIcon } from "@/components/ui/icons/user";
import { Trash2Icon } from "@/components/ui/icons/trash";

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters."
    })
    .max(30, {
      message: "Name must not be longer than 30 characters."
    }),
  email: z.string().email("Please enter a valid email."),
  dob: z.date().optional(),
  language: z.string().min(1, "Please select a language.")
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function Page() {
  const { settings, saveSettings, isSaving } = useUserSettings();
  const { t, locale } = useI18n();
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
  const languages = useMemo(
    () =>
      SUPPORTED_LOCALES.map((value) => ({
        value,
        label: getLanguageLabel(locale, value)
      })),
    [locale]
  );

  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
    initialFiles: settings.profile.avatarUrl
      ? [
          {
            name: "avatar",
            size: 0,
            type: "image/png",
            url: settings.profile.avatarUrl,
            id: "avatar"
          }
        ]
      : []
  });

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: settings.account.name || settings.profile.username,
      email: settings.profile.email,
      language: settings.account.language || "en"
    }
  });

  useEffect(() => {
    form.reset({
      name: settings.account.name || settings.profile.username,
      email: settings.profile.email,
      language: settings.account.language || "en"
    });
  }, [form, settings]);

  const avatarPreview = useMemo(
    () => files[0]?.preview || settings.profile.avatarUrl || null,
    [files, settings.profile.avatarUrl]
  );

  if (!isMounted) {
    return null;
  }

  async function onSubmit(data: AccountFormValues) {
    try {
      await saveSettings({
        account: {
          name: data.name,
          language: data.language
        },
        profile: {
          username: data.name,
          email: data.email,
          bio: settings.profile.bio,
          urls: settings.profile.urls,
          avatarUrl: avatarPreview
        }
      });
      gooey.success({ 
        title: t("account.toast.success"),
        description: "Your profile has been updated and saved." 
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t("account.toast.error");
      gooey.error({ 
        title: "Failed to update account",
        description: message || t("account.toast.error") 
      });
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h3 className="text-lg font-semibold mb-1">Profile Picture</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Update your profile photo. This will be visible across your account.
        </p>
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24 ring-2 ring-border">
            <AvatarImage src={`${avatarPreview ?? ""}`} />
            <AvatarFallback className="bg-muted">
              <UserIcon className="h-12 w-12 opacity-40" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <Button 
              type="button" 
              onClick={openFileDialog} 
              variant="outline"
              className="w-fit"
              aria-haspopup="dialog"
            >
              {files[0]?.file ? t("account.changeImage") : t("account.uploadImage")}
            </Button>
            <input
              {...getInputProps()}
              className="sr-only"
              aria-label="Upload image file"
              tabIndex={-1}
            />
            {files[0]?.file && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="w-fit text-destructive hover:text-destructive"
                onClick={() => removeFile(files[0]?.id)}>
                <Trash2Icon className="h-4 w-4 mr-2" animateOnHover />
                Remove
              </Button>
            )}
            <p className="text-xs text-muted-foreground max-w-xs">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-1">Personal Information</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This information will be displayed publicly on your profile.
            </p>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{t("account.name.label")}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t("account.name.placeholder")} 
                        className="max-w-md"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {t("account.name.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{t("account.email.label")}</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder={t("account.email.placeholder")} 
                        className="max-w-md"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {t("account.email.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-1">Preferences</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Customize your experience and language settings.
            </p>
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-medium">{t("account.language.label")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full max-w-md justify-between",
                            !field.value && "text-muted-foreground"
                          )}>
                          {field.value
                            ? languages.find((language) => language.value === field.value)?.label
                            : t("account.language.placeholder")}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
                      <Command>
                        <CommandInput placeholder={t("account.language.searchPlaceholder")} />
                        <CommandList>
                          <CommandEmpty>{t("account.language.empty")}</CommandEmpty>
                          <CommandGroup>
                            {languages.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("language", language.value);
                                }}>
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    language.value === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {language.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-xs">
                    {t("account.language.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              Make sure to save your changes before leaving this page.
            </p>
            <Button type="submit" disabled={isSaving} size="lg">
              {isSaving ? t("account.savingButton") : t("account.updateButton")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
