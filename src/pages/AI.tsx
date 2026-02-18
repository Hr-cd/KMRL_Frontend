import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { askAI } from "@/lib/api";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
interface Document {
  id: string;
  name: string;
}

async function fetchDocuments(): Promise<Document[]> {
  const res = await fetch("http://localhost:8000/api/documents");
  if (!res.ok) throw new Error("Failed to fetch documents");
  const data = await res.json();
  console.log("Documents fetched:", data);
  return data;
  
}   

export default function AI() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your KMRL Document Assistant. You can ask me questions about any document — select one from the dropdown or ask a general question.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
   const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
    fetchDocuments()
      .then((docs) => {
        setDocuments(docs);
        if (docs.length) setSelectedDocId(docs[0].id.toString());
      })
      .catch((err) =>
        setMessages((prev) => [
          ...prev,
          {
            id: "error-doc-fetch",
            role: "assistant",
            content:
              "Failed to fetch documents. Please refresh the page. Error: " +
              err.message,
            timestamp: new Date(),
          },
        ])
      );
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !selectedDocId || isLoading) return;
    await askAI(input.trim(), selectedDocId); 
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await askAI(text, selectedDocId);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Sorry, I couldn't process your request. Please try again. Error: " +
            err.message,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg">Document AI Chat</h1>
            <p className="text-xs text-muted-foreground">Ask questions about your documents</p>
          </div>
        </div>

        <Select value={selectedDocId} onValueChange={(val) => setSelectedDocId(val)}>
          <SelectTrigger className="w-72">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Select document context">
                {documents.find(d => d.id.toString() === selectedDocId)?.name || "Select Document"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
                {documents.map((doc) => (
                <SelectItem key={doc.id} value={doc.id.toString()}>
                    {doc.name}
                </SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <Card className={`max-w-[75%] p-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50"
              }`}>
                {msg.content}
              </Card>
              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-1">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <Card className="bg-muted/50 p-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </Card>
            </div>
          )} 
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
                }
            }}
            placeholder="Ask about this document..."
            rows={1}
            className="resize-none min-h-[44px]"
            />
            <Button size="icon" className="shrink-0 h-11 w-11" onClick={handleSend}>
            <Send className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </div>
  );
}
