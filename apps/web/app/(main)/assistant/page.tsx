import { Metadata } from "next";
import { generateMeta } from "@/lib/utils";

import AssistantChatShell from "@/components/chat/assistant-chat-shell";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Lyceum - AI Assistant",
    description:
      "Lyceum is an AI-powered learning platform designed to bring personalized, interactive education to everyone.",
    canonical: "/assistant"
  });
}

export default function Page() {
  return (
    <AssistantChatShell />
  );
}
