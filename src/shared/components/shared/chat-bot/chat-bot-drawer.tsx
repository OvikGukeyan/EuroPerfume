'use client';
import React, { FC } from "react";
import { cn } from "../../../lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { Button, Title } from "../..";
import { BotMessageSquare } from "lucide-react";
import { ChatAssistant } from "./chat-assistant";

type Props = {
  className?: string;
};

export const ChatBotDrawer: FC<Props> = ({ className }) => {
  return (
    <div className={cn("fixed top-[80%] right-5  z-50", className)}>
      <Sheet >
        <SheetTrigger asChild>
          <Button  className=" flex gap-4  items-center">
            <BotMessageSquare />
            <span className="text-xs">AI Chat</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side={"right"}
          className="flex flex-col justify-between bg-[#FFF] px-8 py-12  overflow-y-auto "
        >
          <ChatAssistant />
        </SheetContent>
      </Sheet>
    </div>
  );
};
