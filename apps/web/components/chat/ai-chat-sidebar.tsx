"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, PanelLeftOpen } from "honestui/icons";
import { EllipsisVertical, Plus } from "@/components/ui/animated-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

import { useAssistantChat } from "./assistant-chat-provider";

export const SidebarContent = () => {
  const {
    conversations,
    selectConversation,
    selectedConversationId,
    startNewConversation,
    renameConversation,
    deleteConversation
  } =
    useAssistantChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConversations, setFilteredConversations] = useState(conversations);

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [conversationToRename, setConversationToRename] = useState<{ id: string; title: string } | null>(null);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  React.useEffect(() => {
    if (!searchQuery) {
      setFilteredConversations(conversations);
      return;
    }
    const lower = searchQuery.toLowerCase();
    setFilteredConversations(
      conversations.filter((c) => (c.title || "").toLowerCase().includes(lower))
    );
  }, [searchQuery, conversations]);

  return (
    <div className="flex h-full flex-col lg:w-72">
      <div className="border-b px-4 py-2">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-1 z-10 h-4 w-4 -translate-y-1/2 transform" />
          <input
            type="text"
            placeholder="Search chats..."
            className="text-foreground placeholder:text-muted-foreground h-10 w-full rounded-none border-none bg-transparent pl-8 text-sm shadow-none outline-none focus-visible:ring-0"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="grow space-y-4 overflow-y-auto px-4 py-3 lg:space-y-8">
        <div className="space-y-0.5">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "group flex items-center rounded-lg border border-transparent transition-colors",
                selectedConversationId === conversation.id && "bg-black/8 dark:bg-white/12"
              )}>
              <button
                onClick={() => selectConversation(conversation.id)}
                className={cn(
                  "block w-full min-w-0 cursor-pointer justify-start truncate rounded-lg p-2 px-3 text-start text-sm text-foreground"
                )}>
                {conversation.title || "Untitled chat"}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="text-muted-foreground inline-flex h-7 w-7 items-center justify-center rounded-md border-0 bg-transparent p-0 opacity-70 transition-opacity hover:bg-transparent hover:text-foreground focus-visible:outline-none focus-visible:ring-0 md:opacity-0 md:group-hover:opacity-100 data-[state=open]:opacity-100">
                    <EllipsisVertical className="size-3.5" animateOnHover />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      setConversationToRename({
                        id: conversation.id,
                        title: conversation.title || "Untitled chat"
                      });
                      setNewTitle(conversation.title || "Untitled chat");
                      setIsRenameOpen(true);
                    }}>
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500!"
                    onClick={() => {
                      setConversationToDelete(conversation.id);
                      setIsDeleteOpen(true);
                    }}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
        {filteredConversations.length === 0 && (
          <div className="text-muted-foreground py-4 text-center text-sm">
            {searchQuery ? "No conversations found" : "No conversations yet"}
          </div>
        )}
      </div>

      <div className="border-t px-4 py-3">
        <Button className="w-full" onClick={() => startNewConversation()}>
          <Plus animateOnHover />
          New Chat
        </Button>
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new chat title..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && conversationToRename) {
                  renameConversation(conversationToRename.id, newTitle);
                  setIsRenameOpen(false);
                }
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                if (conversationToRename) {
                  renameConversation(conversationToRename.id, newTitle);
                  setIsRenameOpen(false);
                }
              }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (conversationToDelete) {
                  deleteConversation(conversationToDelete);
                  setIsDeleteOpen(false);
                }
              }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default function AIChatSidebar() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute start-2 top-2 z-20 rounded-full border bg-background shadow-sm hover:bg-muted md:hidden"
          aria-label="Open chat sidebar">
          <PanelLeftOpen className="size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-72 p-0 data-[vaul-drawer-direction=left]:rounded-r-2xl">
        <SidebarContent />
      </DrawerContent>
    </Drawer>
  );
}
