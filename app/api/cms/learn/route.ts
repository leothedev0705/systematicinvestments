import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "learn.json");

// Helper to read data
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { content: [], categories: [] };
  }
}

// Helper to write data
function writeData(data: { content: unknown[]; categories: unknown[] }) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET all content
export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

// POST new content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = readData();
    
    const newContent = {
      ...body,
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    data.content.unshift(newContent);
    writeData(data);
    
    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 });
  }
}

// PUT update existing
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const data = readData();
    const index = data.content.findIndex((c: { id: string }) => c.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }
    
    data.content[index] = { ...data.content[index], ...updateData };
    writeData(data);
    
    return NextResponse.json(data.content[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE content
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    
    const data = readData();
    data.content = data.content.filter((c: { id: string }) => c.id !== id);
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

