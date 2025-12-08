import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "updates.json");

// Helper to read data
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { updates: [] };
  }
}

// Helper to write data
function writeData(data: { updates: unknown[] }) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET all updates
export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.updates);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch updates" }, { status: 500 });
  }
}

// POST new update
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = readData();
    
    const newUpdate = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    data.updates.unshift(newUpdate);
    writeData(data);
    
    return NextResponse.json(newUpdate, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create update" }, { status: 500 });
  }
}

// PUT update existing
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const data = readData();
    const index = data.updates.findIndex((u: { id: string }) => u.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Update not found" }, { status: 404 });
    }
    
    data.updates[index] = { ...data.updates[index], ...updateData };
    writeData(data);
    
    return NextResponse.json(data.updates[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE update
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    
    const data = readData();
    data.updates = data.updates.filter((u: { id: string }) => u.id !== id);
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

