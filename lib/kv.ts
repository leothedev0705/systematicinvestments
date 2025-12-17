import { createClient } from "@vercel/kv";

// Initialize KV client with support for CMS_ prefixed variables
// Vercel creates variables with CMS_ prefix when connecting through the dashboard
const getKVClient = () => {
  const url = process.env.CMS_KV_REST_API_URL || process.env.KV_REST_API_URL;
  const token = process.env.CMS_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN;
  
  if (!url || !token) {
    throw new Error("KV credentials not found. Please set CMS_KV_REST_API_URL and CMS_KV_REST_API_TOKEN (or KV_REST_API_URL and KV_REST_API_TOKEN)");
  }
  
  return createClient({
    url,
    token,
  });
};

const kv = getKVClient();

// KV Keys
const KV_KEYS = {
  LEARN_CONTENT: "cms:learn",
  UPDATES: "cms:updates",
  SETTINGS: "cms:settings",
} as const;

// Types
export interface LearnContent {
  id: string;
  category: string;
  type: "video" | "presentation";
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  downloadUrl?: string;
  duration: string;
  level: string;
  views: string;
  rating: number;
  instructor: string;
  topics: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Update {
  id: string;
  type: "bond" | "news" | "document";
  category: string;
  title: string;
  description: string;
  fullDescription?: string;
  rate?: string;
  minInvestment?: string;
  maxInvestment?: string;
  tenure?: string;
  date: string;
  isNew: boolean;
  features: string[];
  documentUrl?: string;
  createdAt: string;
}

export interface Settings {
  adminPassword: string | null;
  lastPasswordChange: string | null;
}

// Learn Content Operations
export async function getLearnContent(): Promise<{ content: LearnContent[]; categories: unknown[] }> {
  try {
    const data = await kv.get<{ content: LearnContent[]; categories: unknown[] }>(KV_KEYS.LEARN_CONTENT);
    return data || { content: [], categories: [] };
  } catch (error) {
    console.error("Error reading learn content from KV:", error);
    return { content: [], categories: [] };
  }
}

export async function setLearnContent(data: { content: LearnContent[]; categories: unknown[] }): Promise<void> {
  try {
    await kv.set(KV_KEYS.LEARN_CONTENT, data);
  } catch (error) {
    console.error("Error writing learn content to KV:", error);
    throw error;
  }
}

// Updates Operations
export async function getUpdates(): Promise<Update[]> {
  try {
    const updates = await kv.get<Update[]>(KV_KEYS.UPDATES);
    return updates || [];
  } catch (error) {
    console.error("Error reading updates from KV:", error);
    return [];
  }
}

export async function setUpdates(updates: Update[]): Promise<void> {
  try {
    await kv.set(KV_KEYS.UPDATES, updates);
  } catch (error) {
    console.error("Error writing updates to KV:", error);
    throw error;
  }
}

// Settings Operations
export async function getSettings(): Promise<Settings> {
  try {
    const settings = await kv.get<Settings>(KV_KEYS.SETTINGS);
    return settings || { adminPassword: null, lastPasswordChange: null };
  } catch (error) {
    console.error("Error reading settings from KV:", error);
    return { adminPassword: null, lastPasswordChange: null };
  }
}

export async function setSettings(settings: Settings): Promise<void> {
  try {
    await kv.set(KV_KEYS.SETTINGS, settings);
  } catch (error) {
    console.error("Error writing settings to KV:", error);
    throw error;
  }
}

// Helper to get admin password
export async function getAdminPassword(): Promise<string> {
  const settings = await getSettings();
  return settings.adminPassword || process.env.CMS_PASSWORD || "vb@29121971";
}

