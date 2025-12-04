"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Calculator,
  TrendingUp,
  PiggyBank,
  Shield,
  Loader2,
  Settings,
  Key,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  { icon: Calculator, text: "Calculate SIP returns" },
  { icon: TrendingUp, text: "Best mutual funds?" },
  { icon: PiggyBank, text: "How to start investing?" },
  { icon: Shield, text: "Term insurance guide" },
];

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("server"); // Default to "server" - API key is on server
  const [tempApiKey, setTempApiKey] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useServerKey, setUseServerKey] = useState(true); // Server has the API key
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check for custom API key in localStorage (optional override)
  useEffect(() => {
    const savedKey = localStorage.getItem("sifi_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setTempApiKey(savedKey);
      setUseServerKey(false);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !showSettings) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, showSettings]);

  const saveApiKey = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey.trim());
      localStorage.setItem("sifi_api_key", tempApiKey.trim());
      setUseServerKey(false);
      setShowSettings(false);
      setError(null);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          // Only send client API key if user has set one (not using server key)
          apiKey: useServerKey ? null : apiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split("\n")
      .map((line, i) => {
        // Headers
        if (line.startsWith("### ")) {
          return (
            <h4 key={i} className="font-semibold text-primary mt-3 mb-1">
              {line.replace("### ", "")}
            </h4>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h3 key={i} className="font-bold text-primary mt-3 mb-2">
              {line.replace("## ", "")}
            </h3>
          );
        }
        // Bullet points
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <li key={i} className="ml-4 text-sm">
              {line.replace(/^[-•] /, "")}
            </li>
          );
        }
        // Bold text
        const boldFormatted = line.replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold">$1</strong>'
        );
        // Empty lines
        if (!line.trim()) {
          return <br key={i} />;
        }
        return (
          <p
            key={i}
            className="text-sm mb-1"
            dangerouslySetInnerHTML={{ __html: boldFormatted }}
          />
        );
      });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-light shadow-elevated flex items-center justify-center text-white hover:shadow-glow transition-shadow ${
          isOpen ? "hidden" : ""
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 1 }}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-primary" />
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[420px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-elevated flex flex-col overflow-hidden border border-card-border"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-light p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-white text-sm">
                    SIFI - Financial Assistant
                  </h3>
                  <p className="text-white/70 text-xs">
                    Powered by Systematic Investments
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Settings className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={clearChat}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  title="Clear chat"
                >
                  <RefreshCw className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-primary/5 border-b border-card-border overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        Custom API Key (Optional)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder="sk-... (leave empty to use default)"
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-card-border bg-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                      <button
                        onClick={saveApiKey}
                        disabled={!tempApiKey.trim()}
                        className="px-3 py-2 bg-accent text-primary text-sm font-medium rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted mt-2">
                      {useServerKey 
                        ? "✓ Using Systematic Investments' AI service. Add your own key for unlimited usage."
                        : "Using your custom API key. Clear to use default."}
                    </p>
                    {!useServerKey && (
                      <button
                        onClick={() => {
                          localStorage.removeItem("sifi_api_key");
                          setApiKey("server");
                          setTempApiKey("");
                          setUseServerKey(true);
                          setShowSettings(false);
                        }}
                        className="text-xs text-accent hover:underline mt-2"
                      >
                        Reset to default
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1 bg-primary/5 rounded-2xl rounded-tl-md p-4">
                      <p className="text-sm text-navy-700 mb-3">
                        👋 Namaste! I&apos;m <strong>SIFI</strong> (Systematic Investments Financial Intelligence), 
                        your personal financial advisor with expertise equivalent to a CA, CFA, and CFP combined!
                      </p>
                      <p className="text-sm text-navy-700 mb-3">
                        I can help you with:
                      </p>
                      <ul className="text-sm text-navy-700 space-y-1 mb-3">
                        <li>📊 Investment planning & calculations</li>
                        <li>📈 Mutual funds, stocks & market analysis</li>
                        <li>🏦 FDs, loans & interest calculations</li>
                        <li>🛡️ Insurance & risk management</li>
                        <li>📋 Tax planning & savings</li>
                        <li>🎯 Goal-based financial planning</li>
                      </ul>
                      <p className="text-sm text-navy-700">
                        How can I help you today?
                      </p>
                    </div>
                  </div>

                  {/* Quick Questions */}
                  <div className="pl-11">
                    <p className="text-xs text-muted mb-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickQuestion(q.text)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-card-border rounded-full text-xs text-navy-700 hover:bg-primary/5 hover:border-primary/20 transition-colors"
                        >
                          <q.icon className="w-3 h-3 text-accent" />
                          {q.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-accent"
                        : "bg-primary"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-primary" />
                    ) : (
                      <Bot className="w-4 h-4 text-accent" />
                    )}
                  </div>
                  <div
                    className={`flex-1 rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-accent/10 rounded-tr-md"
                        : "bg-primary/5 rounded-tl-md"
                    }`}
                  >
                    <div className="text-navy-700">
                      {message.role === "assistant"
                        ? formatMessage(message.content)
                        : <p className="text-sm">{message.content}</p>
                      }
                    </div>
                    <p className="text-[10px] text-muted mt-2">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-accent" />
                  </div>
                  <div className="bg-primary/5 rounded-2xl rounded-tl-md p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-sm text-muted">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-card-border bg-background/50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about finance..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl border border-card-border bg-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <p className="text-[10px] text-center text-muted mt-2">
                SIFI by Systematic Investments • For personalized advice, call{" "}
                <a href="tel:+919821255653" className="text-accent hover:underline">
                  +91 98212 55653
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

