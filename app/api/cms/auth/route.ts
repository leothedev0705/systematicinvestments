import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Get admin password from settings or env
function getAdminPassword(): string {
  try {
    const settingsFile = path.join(process.cwd(), "data", "settings.json");
    const data = fs.readFileSync(settingsFile, "utf-8");
    const settings = JSON.parse(data);
    return settings.adminPassword || process.env.CMS_PASSWORD || "systematic2024";
  } catch {
    return process.env.CMS_PASSWORD || "systematic2024";
  }
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const ADMIN_PASSWORD = getAdminPassword();
    
    if (password === ADMIN_PASSWORD) {
      // Create a simple session token
      const token = Buffer.from(`admin:${Date.now()}`).toString("base64");
      
      const response = NextResponse.json({ success: true });
      
      // Set HTTP-only cookie
      response.cookies.set("cms_auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      
      return response;
    }
    
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("cms_auth")?.value;
    
    if (token) {
      // Basic token validation
      const decoded = Buffer.from(token, "base64").toString();
      if (decoded.startsWith("admin:")) {
        return NextResponse.json({ authenticated: true });
      }
    }
    
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("cms_auth");
  return response;
}

