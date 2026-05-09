"use client";

import { Card } from "@/components/ui/card";
import { getParentAppData } from "@/src/lib/parent";
import { Send } from "lucide-react";
import { useState } from "react";

const categories = ["admin", "teacher", "finance", "transport", "aftercare"] as const;

export function ParentMessagesView() {
  const data = getParentAppData();
  const [category, setCategory] = useState<(typeof categories)[number]>("admin");
  const [messages, setMessages] = useState([
    { id: "m1", from: "School Office", body: "Good day. How can we help you today?", at: "08:15" }
  ]);
  const [body, setBody] = useState("");

  function sendMessage() {
    if (!body.trim()) return;
    setMessages((prev) => [...prev, { id: `msg_${Date.now()}`, from: data.guardian.fullName, body, at: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }) }]);
    setBody("");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-pine-900 p-5 text-white">
        <p className="text-sm text-white/70">Contact school</p>
        <h1 className="mt-1 text-2xl font-semibold">Messages</h1>
      </div>
      <Card>
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Category</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-3 py-2 text-xs capitalize ${category === item ? "bg-pine-900 text-white" : "border border-slate-200 text-slate-600"}`}>
              {item}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600">Auto-routing placeholder: this message will route to {category} staff.</p>
      </Card>
      <Card>
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`rounded-2xl p-3 text-sm ${message.from === data.guardian.fullName ? "ml-8 bg-pine-900 text-white" : "mr-8 bg-slate-100 text-slate-800"}`}>
              <p className="font-medium">{message.from}</p>
              <p className="mt-1">{message.body}</p>
              <p className="mt-1 text-xs opacity-70">{message.at}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type a message" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <button onClick={sendMessage} className="rounded-xl bg-pine-900 p-3 text-white" aria-label="Send message"><Send className="h-4 w-4" /></button>
        </div>
      </Card>
    </div>
  );
}
