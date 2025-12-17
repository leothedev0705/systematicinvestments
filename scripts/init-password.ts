/**
 * Initialize CMS password in Vercel KV
 * 
 * Run this script to set the initial password:
 * npx tsx scripts/init-password.ts
 * 
 * Make sure you have KV_REST_API_URL and KV_REST_API_TOKEN in your .env.local
 */

import { kv } from "@vercel/kv";

const INITIAL_PASSWORD = "vb@29121971";

async function initPassword() {
  console.log("🔐 Initializing CMS password...\n");

  // Check for KV environment variables
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error("❌ Missing KV environment variables!");
    console.log("Please set KV_REST_API_URL and KV_REST_API_TOKEN in your .env.local");
    process.exit(1);
  }

  try {
    // Get existing settings or create new
    const existingSettings = await kv.get<{ adminPassword: string | null; lastPasswordChange: string | null }>("cms:settings");
    
    const settings = existingSettings || { adminPassword: null, lastPasswordChange: null };
    
    // Only set if password is not already set
    if (!settings.adminPassword) {
      settings.adminPassword = INITIAL_PASSWORD;
      settings.lastPasswordChange = new Date().toISOString();
      
      await kv.set("cms:settings", settings);
      console.log("✅ Password initialized successfully!");
      console.log(`   Password: ${INITIAL_PASSWORD}`);
      console.log("\n📝 You can change this password from the CMS admin panel after logging in.");
    } else {
      console.log("⚠️  Password already set in KV.");
      console.log("   To reset it, delete the 'cms:settings' key in KV or use the admin panel to change it.");
    }
  } catch (error) {
    console.error("❌ Error initializing password:", error);
    process.exit(1);
  }
}

initPassword().catch(console.error);

