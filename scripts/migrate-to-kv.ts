/**
 * Migration script to move data from JSON files to Vercel KV
 * 
 * Run this script locally before deploying to Vercel:
 * npx tsx scripts/migrate-to-kv.ts
 * 
 * Make sure you have:
 * 1. KV_REST_API_URL and KV_REST_API_TOKEN in your .env.local
 * 2. Existing data files in the data/ directory
 */

import { kv } from "@vercel/kv";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function migrateLearnContent() {
  const filePath = path.join(DATA_DIR, "learn.json");
  
  if (!fs.existsSync(filePath)) {
    console.log("⚠️  learn.json not found, skipping...");
    return;
  }

  try {
    const fileData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    await kv.set("cms:learn", fileData);
    console.log("✅ Migrated learn content to KV");
  } catch (error) {
    console.error("❌ Error migrating learn content:", error);
  }
}

async function migrateUpdates() {
  const filePath = path.join(DATA_DIR, "updates.json");
  
  if (!fs.existsSync(filePath)) {
    console.log("⚠️  updates.json not found, skipping...");
    return;
  }

  try {
    const fileData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const updates = fileData.updates || [];
    await kv.set("cms:updates", updates);
    console.log(`✅ Migrated ${updates.length} updates to KV`);
  } catch (error) {
    console.error("❌ Error migrating updates:", error);
  }
}

async function migrateSettings() {
  const filePath = path.join(DATA_DIR, "settings.json");
  
  if (!fs.existsSync(filePath)) {
    console.log("⚠️  settings.json not found, skipping...");
    return;
  }

  try {
    const fileData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    await kv.set("cms:settings", fileData);
    console.log("✅ Migrated settings to KV");
  } catch (error) {
    console.error("❌ Error migrating settings:", error);
  }
}

async function main() {
  console.log("🚀 Starting migration to Vercel KV...\n");

  // Check for KV environment variables
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error("❌ Missing KV environment variables!");
    console.log("Please set KV_REST_API_URL and KV_REST_API_TOKEN in your .env.local");
    console.log("You can find these in your Vercel dashboard under Storage > KV");
    process.exit(1);
  }

  await migrateLearnContent();
  await migrateUpdates();
  await migrateSettings();

  console.log("\n✨ Migration complete!");
  console.log("\n📝 Next steps:");
  console.log("1. Deploy to Vercel");
  console.log("2. Add KV environment variables in Vercel dashboard");
  console.log("3. Access CMS at: https://your-domain.vercel.app/admin");
}

main().catch(console.error);

