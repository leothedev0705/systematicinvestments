import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

// Helper to read settings
function readSettings() {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { adminPassword: null, lastPasswordChange: null };
  }
}

// Helper to write settings
function writeSettings(data: Record<string, unknown>) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
}

// Get current password (for validation) - internal function, not exported
function getAdminPassword(): string {
  const settings = readSettings();
  // If custom password is set in settings, use it; otherwise fall back to env
  return settings.adminPassword || process.env.CMS_PASSWORD || "systematic2024";
}

// POST - Change password
export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();
    
    const actualPassword = getAdminPassword();
    
    // Verify current password
    if (currentPassword !== actualPassword) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }
    
    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }
    
    // Update settings
    const settings = readSettings();
    settings.adminPassword = newPassword;
    settings.lastPasswordChange = new Date().toISOString();
    writeSettings(settings);
    
    return NextResponse.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}

