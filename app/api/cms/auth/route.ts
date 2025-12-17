import { NextRequest, NextResponse } from "next/server";
import { getAdminPassword } from "@/lib/kv";

// Default password fallback (if KV is not set up yet)
const DEFAULT_PASSWORD = process.env.CMS_PASSWORD || "vb@29121971";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    let ADMIN_PASSWORD: string;
    
    try {
      ADMIN_PASSWORD = await getAdminPassword();
    } catch (error) {
      // Fallback to default if KV is not available
      console.warn("KV not available, using default password:", error);
      ADMIN_PASSWORD = DEFAULT_PASSWORD;
    }
    
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
    console.error("Error authenticating:", error);
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

