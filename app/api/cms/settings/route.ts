import { NextRequest, NextResponse } from "next/server";
import { getSettings, setSettings, getAdminPassword } from "@/lib/kv";

// POST - Change password
export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();
    
    const actualPassword = await getAdminPassword();
    
    // Verify current password
    if (currentPassword !== actualPassword) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }
    
    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }
    
    // Update settings
    const settings = await getSettings();
    settings.adminPassword = newPassword;
    settings.lastPasswordChange = new Date().toISOString();
    await setSettings(settings);
    
    return NextResponse.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}

