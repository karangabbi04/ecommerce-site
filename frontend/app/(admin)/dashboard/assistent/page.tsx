"use client"; // Agar Next.js use kar rahe ho

import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, User, Minimize2, Maximize2 } from "lucide-react";
import PromptInput from "@/components/admin/ai-assistant/prompt-input";
import { aiAssistant, type AIConversationMessage } from "@/services/ai.service";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


interface ChatMessage {
  id: number;
  role: "ai" | "user";
  content: string;
}

export default function AIChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: "ai", content: "Hello! Main tumhara E-commerce AI Assistant hun. Aaj main tumhari kaise help kar sakta hun?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now(), role: "user", content: message };
      const conversationHistory: AIConversationMessage[] = messages.map((item) => ({
      role: item.role === "ai" ? "model" : "user",
      content: item.content,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await aiAssistant.chatWithAdminAssistant(message, conversationHistory);
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        role: "ai",
        content: response.reply || "I couldn't generate a response.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        role: "ai",
        content: error instanceof Error ? error.message : "Message send nahi ho saka. Dobara try karein.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    // Yeh wrapper tumhare floating panel ke andar jayega
    <Card className="flex flex-col h-full w-full border-0 shadow-none rounded-none bg-background">
      

 

      {/* 2. MESSAGES AREA (Scrollable) */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* AI Avatar (Left side) */}
              {msg.role === "ai" && (
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm" // User message (Blue/Primary)
                    : "bg-muted text-foreground rounded-bl-sm"           // AI message (Gray/Muted)
                }`}
              >
                {msg.role === "ai" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => <h1 className="mb-3 text-lg font-bold" >{children}</h1>,
                      h2: ({ children }) => <h2 className="mb-2 mt-4 text-base font-semibold" >{children}</h2>,
                      h3: ({ children }) => <h3 className="mb-2 mt-3 text-sm font-semibold" >{children}</h3>,
                      p: ({ children }) => <p className="mb-3 last:mb-0 leading-6" >{children}</p>,
                      ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0" >{children}</ul>,
                      ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0" >{children}</ol>,
                      li: ({ children }) => <li className="pl-1" >{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold" >{children}</strong>,
                      blockquote: ({ children }) => <blockquote className="my-3 border-l-2 border-primary/40 pl-3 text-muted-foreground" >{children}</blockquote>,
                      table: ({ children }) => (
                        <div className="my-3 overflow-x-auto">
                          <table className="w-full border-collapse text-left text-xs">{children}</table>
                        </div>
                      ),
                      th: ({ children }) => <th className="border px-2 py-1.5 font-semibold" >{children}</th>,
                      td: ({ children }) => <td className="border px-2 py-1.5 align-top" >{children}</td>,
                      a: ({ href, children }) => (
                        <a className="text-primary underline underline-offset-2" href={href} target="_blank" rel="noreferrer">
                          {children}
                        </a>
                      ),
                      pre: ({ children }) => <pre className="my-3 overflow-x-auto rounded-md bg-background/70 p-3 text-xs" >{children}</pre>,
                      code: ({ children }) => <code className="rounded bg-background/70 px-1 py-0.5 text-xs" >{children}</code>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>

              {/* User Avatar (Right side) */}
              {msg.role === "user" && (
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-secondary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* AI Typing Indicator (Three dots) */}
          {isTyping && (
            <div className="flex items-end gap-2 justify-start">
              <Avatar className="h-8 w-8 border">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={scrollRef} /> {/* Auto-scroll anchor */}
        </div>
      </ScrollArea>

      {/* 3. INPUT AREA */}
     
      <div className="p-4 border-t bg-background">
        <PromptInput
          value={input}
          onChange={setInput}
          onSubmit={handleSend}
          disabled={isTyping}
        />
        <p className="text-[10px] text-center text-muted-foreground mt-2">
          AI galtiyan kar sakta hai. Important data cross-check kar lein.
        </p>
      </div>
    </Card>
    
  );
}