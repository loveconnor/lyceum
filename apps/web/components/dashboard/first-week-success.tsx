"use client";

import Link from "next/link";
import {
  Archive,
  CircleCheck as CheckCircle2,
  ChevronRight,
  CircleDashed,
} from "honestui/icons";
import { useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { EllipsisVertical } from "@/components/ui/animated-icons";

import {
  FIRST_WEEK_LOOP_NAME,
  FIRST_WEEK_LOOP_NOTE,
  FIRST_WEEK_LOOP_SUBTITLE
} from "./first-week-copy";

export type FirstWeekStatus = {
  onboarding_complete: boolean;
  module_completed: boolean;
  lab_completed: boolean;
  reflection_written: boolean;
};

type StepDefinition = {
  id: string;
  key: keyof FirstWeekStatus;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
};

type OnboardingStep = StepDefinition & {
  completed: boolean;
};

const HIDE_KEY = "lyceum_hide_getting_started_plan";

const stepDefinitions: StepDefinition[] = [
  {
    id: "onboarding",
    key: "onboarding_complete",
    title: "Complete onboarding",
    description:
      "Finish the quick setup soLyceumcan personalize paths, pacing, and recommendations.",
    actionLabel: "Open onboarding",
    href: "/onboarding"
  },
  {
    id: "module",
    key: "module_completed",
    title: "Finish 1 module",
    description:
      "Complete your first module to unlock tailored next steps in your learning path.",
    actionLabel: "Browse paths",
    href: "/paths"
  },
  {
    id: "lab",
    key: "lab_completed",
    title: "Complete 1 lab",
    description:
      "Run one hands-on lab to apply what you've learned and start building momentum.",
    actionLabel: "Start a lab",
    href: "/labs"
  },
  {
    id: "reflection",
    key: "reflection_written",
    title: "Write 1 reflection",
    description:
      "Capture one reflection to reinforce your understanding and highlight knowledge gaps.",
    actionLabel: "Write reflection",
    href: "/reflections"
  }
];

function mapStatusToSteps(status: FirstWeekStatus): OnboardingStep[] {
  return stepDefinitions.map((step) => ({
    ...step,
    completed: Boolean(status[step.key]),
  }));
}

function CircularProgress({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const strokeDashoffset = 100 - progress;

  return (
    <svg
      className="-rotate-90 scale-y-[-1]"
      height="14"
      width="14"
      viewBox="0 0 14 14">
      <circle
        className="stroke-muted"
        cx="7"
        cy="7"
        fill="none"
        r="6"
        strokeWidth="2"
        pathLength="100"
      />
      <circle
        className="stroke-primary"
        cx="7"
        cy="7"
        fill="none"
        r="6"
        strokeWidth="2"
        pathLength="100"
        strokeDasharray="100"
        strokeLinecap="round"
        style={{ strokeDashoffset }}
      />
    </svg>
  );
}

function StepIndicator({ completed }: { completed: boolean }) {
  if (completed) {
    return <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />;
  }

  return (
    <CircleDashed
      className="mt-0.5 size-4 shrink-0 text-muted-foreground/50"
      strokeWidth={2}
      aria-hidden="true"
    />
  );
}

export function FirstWeekSuccessLoop({ status }: { status: FirstWeekStatus }) {
  const [currentSteps, setCurrentSteps] = useState<OnboardingStep[]>(() => mapStatusToSteps(status));
  const [openStepId, setOpenStepId] = useState<string | null>(() => {
    const firstIncomplete = mapStatusToSteps(status).find((step) => !step.completed);
    return firstIncomplete?.id ?? stepDefinitions[0]?.id ?? null;
  });
  const [dismissedOverride, setDismissedOverride] = useState(false);
  const dismissedFromStore = useSyncExternalStore(
    () => () => undefined,
    () => {
      if (typeof window === "undefined") return false;

      try {
        return window.localStorage.getItem(HIDE_KEY) === "1";
      } catch (error) {
        console.error("Failed to read getting-started visibility", error);
        return false;
      }
    },
    () => false
  );
  const dismissed = dismissedFromStore || dismissedOverride;

  const completedCount = currentSteps.filter((step) => step.completed).length;
  const remainingCount = currentSteps.length - completedCount;

  const handleStepClick = (stepId: string) => {
    setOpenStepId((currentOpenStepId) => (currentOpenStepId === stepId ? null : stepId));
  };

  const handleStepAction = (stepId: string) => {
    setCurrentSteps((previous) =>
      previous.map((step) => (step.id === stepId ? { ...step, completed: true } : step))
    );
  };

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(HIDE_KEY, "1");
      setDismissedOverride(true);
    } catch (error) {
      console.error("Failed to dismiss getting-started plan", error);
    }
  };

  if (dismissed) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <div className="mb-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <CardTitle className="ml-1 text-lg">{FIRST_WEEK_LOOP_NAME}</CardTitle>
          <div className="flex items-center justify-end">
            <CircularProgress completed={completedCount} total={currentSteps.length} />
            <div className="ml-1.5 mr-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{remainingCount}</span>{" "}
              <span>of</span>{" "}
              <span className="font-medium text-foreground">{currentSteps.length}</span>{" "}
              <span>left</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="size-7">
                  <EllipsisVertical className="size-4" aria-hidden="true" animateOnHover />
                  <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={handleDismiss}>
                  <Archive className="size-4" aria-hidden="true" />
                  Dismiss
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription>{FIRST_WEEK_LOOP_SUBTITLE}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="space-y-0">
          {currentSteps.map((step, index) => {
            const isOpen = openStepId === step.id;
            const isFirst = index === 0;
            const previousStep = currentSteps[index - 1];
            const isPreviousOpen = previousStep && openStepId === previousStep.id;
            const showBorderTop = !isFirst && !isOpen && !isPreviousOpen;

            return (
              <div
                key={step.id}
                className={cn(
                  "group",
                  isOpen && "rounded-lg",
                  showBorderTop && "border-t border-border"
                )}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleStepClick(step.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleStepClick(step.id);
                    }
                  }}
                  className={cn(
                    "block w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isOpen && "rounded-lg"
                  )}>
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-lg transition-colors",
                      isOpen && "border border-border bg-muted/50"
                    )}>
                    <div className="relative flex items-center justify-between gap-3 px-4 py-3">
                      <div className="flex w-full gap-3">
                        <StepIndicator completed={step.completed} />
                        <div className="grow">
                          <h4
                            className={cn(
                              "font-semibold",
                              step.completed ? "text-primary" : "text-foreground"
                            )}>
                            {step.title}
                          </h4>
                          <Collapsible open={isOpen}>
                            <CollapsibleContent>
                              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                                {step.description}
                              </p>
                              <Button size="sm" className="mt-3" asChild>
                                <Link
                                  href={step.href}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleStepAction(step.id);
                                  }}>
                                  {step.actionLabel}
                                </Link>
                              </Button>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </div>
                      {!isOpen && (
                        <ChevronRight
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">{FIRST_WEEK_LOOP_NOTE}</div>
      </CardContent>
    </Card>
  );
}
