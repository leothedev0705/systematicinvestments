"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  AlertCircle,
  RefreshCw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
} from "lucide-react";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Speech states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check for speech support (microphone access)
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.mediaDevices) {
      setSpeechSupported(true);
    }
  }, []);

  // Load TTS preference
  useEffect(() => {
    const ttsPreference = localStorage.getItem("sifi_tts");
    if (ttsPreference !== null) {
      setTtsEnabled(ttsPreference === "true");
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Speech Recognition using OpenAI Whisper
  const startListening = async () => {
    if (!speechSupported) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await transcribeAudio(audioBlob);
        }
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      console.error('Microphone access error:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          setInputValue(data.text);
        }
      } else {
        console.error('Whisper transcription failed');
      }
    } catch (error) {
      console.error('Transcription error:', error);
    }
  };

  // Text to Speech using OpenAI TTS
  const speak = async (text: string) => {
    if (!ttsEnabled) return;

    // Stop any currently playing audio
    stopSpeaking();

    try {
      setIsSpeaking(true);

      // Call OpenAI TTS API
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      // Create audio element and play
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      setIsSpeaking(false);
      // Fallback to browser TTS if OpenAI fails
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const synth = window.speechSynthesis;
        synth.cancel();
        
        const cleanText = text
          .replace(/#{1,6}\s/g, '')
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/`(.*?)`/g, '$1')
          .replace(/\[(.*?)\]\(.*?\)/g, '$1')
          .replace(/[-•]\s/g, '')
          .replace(/\n+/g, '. ');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-IN';
        utterance.rate = 1;
        utterance.pitch = 1;

        const voices = synth.getVoices();
        const indianVoice = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang.startsWith('en'));
        if (indianVoice) {
          utterance.voice = indianVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synth.speak(utterance);
      }
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleTts = () => {
    const newValue = !ttsEnabled;
    setTtsEnabled(newValue);
    localStorage.setItem("sifi_tts", String(newValue));
    if (!newValue && isSpeaking) {
      stopSpeaking();
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    stopSpeaking();

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

      if (ttsEnabled) {
        speak(data.message);
      }
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
    stopSpeaking();
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
                    {isSpeaking ? "🔊 Speaking..." : isListening ? "🎤 Listening..." : "Powered by SI"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* TTS Toggle */}
                <button
                  onClick={toggleTts}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    ttsEnabled ? 'bg-white/20' : 'bg-white/10'
                  }`}
                  title={ttsEnabled ? "Disable voice" : "Enable voice"}
                >
                  {ttsEnabled ? (
                    <Volume2 className="w-4 h-4 text-white" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-white/60" />
                  )}
                </button>
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                    title="Stop speaking"
                  >
                    <Square className="w-3 h-3 text-white fill-white" />
                  </button>
                )}
                <button
                  onClick={clearChat}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  title="Clear chat"
                >
                  <RefreshCw className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    stopSpeaking();
                  }}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

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
                        {speechSupported ? "🎤 Use voice input or type your question!" : "How can I help you today?"}
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
                      message.role === "user" ? "bg-accent" : "bg-primary"
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
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none prose-headings:text-navy-700 prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-2 prose-h2:text-base prose-h3:text-sm prose-p:text-navy-700 prose-p:text-sm prose-p:my-1 prose-ul:my-1 prose-li:text-navy-700 prose-li:text-sm prose-li:my-0.5 prose-strong:text-navy-700 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-table:text-xs prose-th:bg-gray-100 prose-th:p-2 prose-td:p-2 prose-blockquote:border-l-accent prose-blockquote:bg-accent/5 prose-blockquote:py-1 prose-blockquote:px-3 prose-blockquote:not-italic prose-blockquote:text-navy-700 prose-blockquote:text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm text-navy-700">{message.content}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] text-muted">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {message.role === "assistant" && speechSupported && (
                        <button
                          onClick={() => speak(message.content)}
                          className="text-muted hover:text-accent transition-colors"
                          title="Read aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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
                  placeholder={isListening ? "Listening..." : "Ask me anything..."}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl border border-card-border bg-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm disabled:opacity-50"
                />
                {/* Voice Input Button */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isLoading}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <p className="text-[10px] text-center text-muted mt-2">
                {speechSupported && "🎤 Voice enabled • "}
                SIFI by Systematic Investments
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
